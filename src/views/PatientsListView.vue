<template>
  <div class="patients-list-view">
    <!-- Loading State -->
    <div v-if="loading" class="loading-container">
      <div class="spinner"></div>
      <p>Chargement des patients...</p>
    </div>

    <!-- Error State -->
    <div v-if="error" class="error-container">
      <p>❌ Erreur : {{ error }}</p>
      <button class="btn btn-primary" @click="loadPatients">Réessayer</button>
    </div>

    <!-- Main Content -->
    <template v-if="!loading && !error">
    <!-- Header de la page -->
    <div class="page-title-bar">
      <div>
        <h1 class="page-title">Patients</h1>
        <p class="page-subtitle">
          {{ filteredPatients.length }} patients · {{ alertesCount }} avec alertes critiques
        </p>
      </div>
      <div class="page-actions">
        <button class="btn btn-secondary" @click="generatePatientsPDF()">
          📥 Export
        </button>
        <button class="btn btn-primary" @click="showFormModal = true">
          ➕ Nouveau patient
        </button>
      </div>
    </div>

    <!-- Barre de recherche + filtres dropdown -->
    <div class="filters-bar">
      <div class="search-wrapper">
        <SearchInput
          v-model="searchQuery"
          placeholder="Rechercher par nom, prénom ou chambre..."
        />
      </div>
      <select v-model="filterEtage" class="filter-select">
        <option value="">Tous les étages</option>
        <option value="1">1er étage</option>
        <option value="2">2ème étage</option>
        <option value="3">3ème étage</option>
      </select>
      <select v-model="filterAS" class="filter-select">
        <option value="">Tous les AS</option>
        <option value="SE1">SE1</option>
        <option value="SE2">SE2</option>
        <option value="SC1">SC1</option>
        <option value="SC2">SC2</option>
        <option value="SG">SG</option>
      </select>
      <select v-model="filterCategorie" class="filter-select">
        <option value="">Toutes catégories</option>
        <option v-for="cat in categorieListe" :key="cat.id" :value="cat.id">
          {{ cat.icon }} {{ cat.label }}
        </option>
      </select>
      <select v-model="filterProfil" class="filter-select">
        <option value="">Tous les profils</option>
        <option v-for="profil in profilListe" :key="profil.id" :value="profil.id">
          Profil {{ profil.numero }} - {{ profil.label }}
        </option>
      </select>
    </div>

    <!-- Filtres rapides -->
    <div class="quick-filters">
      <FilterPill
        :active="filterQuick === 'all'"
        :count="patients.length"
        @click="filterQuick = 'all'"
      >
        Tous
      </FilterPill>
      <FilterPill
        :active="filterQuick === 'etage1'"
        :count="countByEtage(1)"
        @click="filterQuick = 'etage1'"
      >
        1er étage
      </FilterPill>
      <FilterPill
        :active="filterQuick === 'etage2'"
        :count="countByEtage(2)"
        @click="filterQuick = 'etage2'"
      >
        2ème étage
      </FilterPill>
      <FilterPill        :active="filterQuick === 'etage3'"
        :count="countByEtage(3)"
        @click="filterQuick = 'etage3'"
      >
        3ème étage
      </FilterPill>
      <FilterPill        :active="filterQuick === 'alertes'"
        :count="alertesCount"
        variant="danger"
        @click="filterQuick = 'alertes'"
      >
        ⚠️ Avec alertes
      </FilterPill>
      <FilterPill
        :active="filterQuick === 'sansDouche'"
        :count="sansDoucheCount"
        variant="danger"
        @click="filterQuick = 'sansDouche'"
      >
        Sans douche
      </FilterPill>
    </div>

    <!-- Filtre par catégorie -->
    <CategoryFilter v-model="filterCategory" />

    <!-- Filtre par priorité -->
    <PriorityFilter v-model="filterPriority" />

    <!-- Tableau -->
    <PatientsTable
      :patients="paginatedPatients"
      :sort-key="sortKey"
      :sort-order="sortOrder"
      @open-patient="openPatient"
      @sort="handleSort"
      @update-patient="updatePatient"
      @reorder-patients="handleReorderPatients"
      @move-patient="handleMovePatient"
    />

    <!-- Pagination -->
    <Pagination
      v-if="totalPages > 1"
      :current-page="currentPage"
      :total-pages="totalPages"
      :page-size="pageSize"
      :total="filteredPatients.length"
      @change="currentPage = $event"
    />
    </template>
  </div>

  <!-- Modal Création Patient -->
  <PatientFormModal 
    :is-open="showFormModal"
    @close="showFormModal = false"
    @patient-created="onPatientCreated"
  />
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

import SearchInput from '@/components/ui/SearchInput.vue'
import FilterPill from '@/components/ui/FilterPill.vue'
import CategoryFilter from '@/components/ui/CategoryFilter.vue'
import PriorityFilter from '@/components/ui/PriorityFilter.vue'
import PatientsTable from '@/components/patients/PatientsTable.vue'
import Pagination from '@/components/ui/Pagination.vue'
import PatientFormModal from '@/components/forms/PatientFormModal.vue'

import { mockPatients } from '@/data/mockPatients.js'
import { PATIENT_PROFILS, PATIENT_CATEGORIES } from '@/data/mockPatientProfils.js'
import { usePatients } from '@/composables/usePatients'
import { patientService } from '@/api/services/patientService.js'

const router = useRouter()

// API Integration: Charger les patients du backend
const { patients, loading, error, loadPatients } = usePatients()

// Modal
const showFormModal = ref(false)

// Charger au montage
onMounted(() => {
  loadPatients()
})

// Filtres
const searchQuery = ref('')
const filterEtage = ref('')
const filterAS = ref('')
const filterCategorie = ref('')
const filterProfil = ref('')
const filterCategory = ref(null)
const filterPriority = ref(null)
const filterQuick = ref('all')

// Tri
const sortKey = ref(null)
const sortOrder = ref('asc')

// Pagination
const currentPage = ref(1)
const pageSize = ref(10)

// Computed : patients filtrés
const filteredPatients = computed(() => {
  let result = [...patients.value]

  // Recherche texte
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    result = result.filter(p =>
      p.nom.toLowerCase().includes(q) ||
      p.prenom.toLowerCase().includes(q) ||
      p.chambre.toLowerCase().includes(q)
    )
  }

  // Filtre étage dropdown
  if (filterEtage.value) {
    result = result.filter(p => p.etage === parseInt(filterEtage.value))
  }

  // Filtre AS dropdown
  if (filterAS.value) {
    result = result.filter(p => p.asReferent === filterAS.value)
  }

  // Filtre catégorie (select)
  if (filterCategorie.value) {
    result = result.filter(p => p.categorie === filterCategorie.value)
  }

  // Filtre profil (select)
  if (filterProfil.value) {
    result = result.filter(p => p.profil === filterProfil.value)
  }

  // Filtre catégorie (buttons)
  if (filterCategory.value) {
    result = result.filter(p => p.categorie === filterCategory.value)
  }

  // Filtre priorité
  if (filterPriority.value) {
    result = result.filter(p => {
      const profil = PATIENT_PROFILS[p.profil]
      return profil && profil.priorite === filterPriority.value
    })
  }

  // Filtres rapides
  if (filterQuick.value === 'etage1') {
    result = result.filter(p => p.etage === 1)
  } else if (filterQuick.value === 'etage2') {
    result = result.filter(p => p.etage === 2)
  } else if (filterQuick.value === 'etage3') {
    result = result.filter(p => p.etage === 3)
  } else if (filterQuick.value === 'alertes') {
    result = result.filter(p => p.alertes > 0)
  } else if (filterQuick.value === 'sansDouche') {
    result = result.filter(p => p.sansDouche)
  }

  // Tri
  result.sort((a, b) => {
    const aVal = a[sortKey.value] || ''
    const bVal = b[sortKey.value] || ''
    const compare = aVal.toString().localeCompare(bVal.toString())
    return sortOrder.value === 'asc' ? compare : -compare
  })

  return result
})

// Computed : patients paginés
const paginatedPatients = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  return filteredPatients.value.slice(start, start + pageSize.value)
})

const totalPages = computed(() =>
  Math.ceil(filteredPatients.value.length / pageSize.value)
)

// Computed : compteurs
const alertesCount = computed(() =>
  patients.value.filter(p => p.alertes > 0).length
)

const sansDoucheCount = computed(() =>
  patients.value.filter(p => p.sansDouche).length
)

const countByEtage = (etage) =>
  patients.value.filter(p => p.etage === etage).length

// Computed : listes pour les selects
const categorieListe = computed(() =>
  Object.values(PATIENT_CATEGORIES)
)

const profilListe = computed(() =>
  Object.values(PATIENT_PROFILS).sort((a, b) => a.numero - b.numero)
)

// Reset page quand on filtre
watch([searchQuery, filterEtage, filterAS, filterCategorie, filterProfil, filterCategory, filterPriority, filterQuick], () => {
  currentPage.value = 1
})

// Méthodes
const handleSort = (key) => {
  if (sortKey.value === key) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortKey.value = key
    sortOrder.value = 'asc'
  }
}

const updatePatient = async (patientId, field, value) => {
  //la aussi javais un conflit j'ai commenté pour verifier

  /*try {
    const patient = patients.value.find(p => p.id === patientId)
    if (!patient) {
      console.warn(`Patient ${patientId} non trouvé`)
      return
    }

    console.log(`📤 Envoi: PATCH patient ${patientId}: ${field} = ${value}`)

    // Mettre à jour l'état local immédiatement pour une meilleure UX
    patient[field] = value

    // Appeler l'API pour sauvegarder en base de données
    const updatedData = { [field]: value }
    console.log(`📤 Payload envoyé:`, updatedData)
    
    const response = await patientService.update(patientId, updatedData)
    console.log(`✅ Réponse reçue:`, response)
    
    // Mettre à jour le patient avec la réponse du serveur
    if (response && response.id) {
      Object.assign(patient, response)
      console.log(`✅ Patient ${patientId} mise à jour avec succès: ${field} = ${response[field]}`)
    }
  } catch (err) {
    console.error(`❌ Erreur lors de la mise à jour du patient ${patientId}:`, err)
    console.error(`Message d'erreur:`, err.message)
    console.error(`Stack:`, err.stack)
    // Recharger les patients en cas d'erreur pour restaurer l'état initial
    await loadPatients()*/

  const patient = patients.value.find(p => p.id === patientId)
  if (!patient) return
  
  // Sauvegarder la valeur précédente au cas où l'API échoue
  const previousValue = patient[field]
  
  // Mettre à jour localement
  patient[field] = value || null
  
  try {
    // Nettoyer les données avant d'envoyer
    // Convertir les strings vides en null pour les champs numériques
    const cleanedPatient = { ...patient }
    ;['tempsToiletteLit', 'tempsToiletteVasque', 'tempsToiletteMoyen', 'tempsWcMoyen', 'tempsCoucherMoyen'].forEach(field => {
      if (cleanedPatient[field] === '' || cleanedPatient[field] === undefined) {
        cleanedPatient[field] = null
      }
    })
    
    // Envoyer la modification au serveur
    const response = await fetch(`http://localhost:8081/api/patients/${patientId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(cleanedPatient)
    })
    
    if (!response.ok) {
      throw new Error(`Erreur ${response.status}: ${response.statusText}`)
    }
    
    // Récupérer et appliquer la réponse du serveur
    const responseData = await response.json()
    if (responseData && responseData.id) {
      // Mettre à jour le patient local avec la réponse du serveur
      Object.assign(patient, responseData)
      console.log(`✅ Patient ${patientId} mis à jour avec succès. Nouveau ${field}: ${responseData[field]}`)
    } else {
      console.log(`Patient ${patientId} mis à jour avec succès`)
    }
  } catch (err) {
    console.error('Erreur lors de la mise à jour du patient:', err)
    // Restaurer la valeur précédente en cas d'erreur
    patient[field] = previousValue
    alert(`Erreur: La modification n'a pas pu être sauvegardée: ${err.message}`)

  }
}

const handleReorderPatients = (reorderedPagePatients) => {
  // Créer une map des IDs dans le nouvel ordre
  const newOrder = {}
  reorderedPagePatients.forEach((p, idx) => {
    newOrder[p.id] = idx
  })
  
  // Trouver les indices des patients réarrangés dans patients.value
  const reorderedIds = reorderedPagePatients.map(p => p.id)
  const indices = reorderedIds.map(id => patients.value.findIndex(p => p.id === id))
  
  // Créer un nouvel array en réarrangeant les patients
  const result = [...patients.value]
  const reorderedPatients = indices.map(idx => result[idx])
  
  // Supprimer les patients réarrangés de leurs positions actuelles (du dernier au premier)
  indices.sort((a, b) => b - a).forEach(idx => {
    result.splice(idx, 1)
  })
  
  // Insérer les patients réarrangés à la position du premier patient de la page
  const insertIndex = Math.min(...indices)
  result.splice(insertIndex, 0, ...reorderedPatients)
  
  patients.value = result
}

const handleMovePatient = (patientId, direction) => {
  // Trouver l'index dans l'array COMPLET
  const currentIndex = patients.value.findIndex(p => p.id === patientId)
  if (currentIndex === -1) return
  
  const newIndex = currentIndex + direction
  
  // Vérifier les limites
  if (newIndex < 0 || newIndex >= patients.value.length) return
  
  // Créer un nouvel array pour forcer la réactivité
  const newPatients = [...patients.value]
  const temp = newPatients[currentIndex]
  newPatients[currentIndex] = newPatients[newIndex]
  newPatients[newIndex] = temp
  
  // Remplacer l'array complet pour forcer le recalcul de paginatedPatients
  patients.value = newPatients
}

// Génération PDF de la liste des patients (filtrée)
const generatePatientsPDF = () => {
  const doc = new jsPDF('p', 'mm', 'a4')
  const pageWidth = doc.internal.pageSize.getWidth()
  const margin = 15

  // Titre
  doc.setFontSize(14)
  doc.setFont(undefined, 'bold')
  doc.text('Liste des patients', margin, 20)
  doc.setFontSize(10)
  doc.setFont(undefined, 'normal')
  const today = new Date().toLocaleDateString('fr-FR', { year: 'numeric', month: 'short', day: 'numeric' })
  doc.text(`Date: ${today}`, pageWidth - margin, 20, { align: 'right' })

  // En-têtes et corps
  const head = [['ID', 'Nom', 'Prénom', 'Chambre', 'Étage', 'AS', 'Profil', 'Catégorie', 'Alertes', 'Sans douche']]
  const body = filteredPatients.value.map(p => [
    p.id ? p.id.toString() : '',
    p.nom || '',
    p.prenom || '',
    p.chambre || '',
    p.etage != null ? p.etage.toString() : '',
    p.asReferent || '',
    (PATIENT_PROFILS[p.profil] && PATIENT_PROFILS[p.profil].label) || '',
    (PATIENT_CATEGORIES[p.categorie] && PATIENT_CATEGORIES[p.categorie].label) || '',
    p.alertes != null ? p.alertes.toString() : '0',
    p.sansDouche ? 'Oui' : 'Non'
  ])

  autoTable(doc, {
    startY: 28,
    head: head,
    body: body,
    margin: margin,
    styles: { fontSize: 8 },
    headStyles: { fillColor: [37, 99, 235], textColor: [255, 255, 255], fontStyle: 'bold' }
  })

  doc.save(`patients-${today.replace(/ /g, '-')}.pdf`)
}

const openPatient = (id) => {
  router.push(`/patients/${id}`)
}

// Gérer la création d'un nouveau patient
const onPatientCreated = (newPatient) => {
  // Recharger la liste des patients
  loadPatients()
}
</script>

<style scoped>
.patients-list-view {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 2rem;
  padding-bottom: 2rem;
}

/* Page header */
.page-title-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 18px;
  border-bottom: 2px solid #E2E8F0;
}

.page-title {
  font-size: 28px;
  font-weight: 700;
  color: #1E293B;
  margin-bottom: 6px;
  letter-spacing: -0.5px;
}

.page-subtitle {
  font-size: 13px;
  color: #94A3B8;
  font-weight: 500;
}

.page-actions {
  display: flex;
  gap: 10px;
}

/* Boutons */
.btn {
  padding: 10px 16px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  transition: all 0.2s ease;
  border: none;
  cursor: pointer;
}

.btn-secondary {
  background: white;
  border: 1.5px solid #E2E8F0;
  color: #1E293B;
}

.btn-secondary:hover {
  border-color: #2563EB;
  background: #F0F9FF;
  color: #2563EB;
}

.btn-primary {
  background: #2563EB;
  color: white;
}

.btn-primary:hover {
  background: #1D4ED8;
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.2);
}

/* Barre de filtres */
.filters-bar {
  display: flex;
  gap: 12px;
  align-items: center;
  flex-wrap: wrap;
  background: white;
  padding: 16px 18px;
  border-radius: 10px;
  border: 1px solid #E2E8F0;
}

.search-wrapper {
  flex: 1;
  min-width: 300px;
}

.filter-select {
  background: white;
  border: 1.5px solid #E2E8F0;
  border-radius: 8px;
  padding: 9px 12px;
  font-size: 13px;
  color: #1E293B;
  cursor: pointer;
  outline: none;
  transition: all 0.2s ease;
  font-weight: 500;
}

.filter-select:hover {
  border-color: #CBD5E1;
}

.filter-select:focus {
  border-color: #2563EB;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
  background: #F0F9FF;
}

/* Filtres rapides */
.quick-filters {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  background: white;
  padding: 16px 18px;
  border-radius: 10px;
  border: 1px solid #E2E8F0;
}

@media (max-width: 768px) {
  .page-title-bar {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .page-actions {
    width: 100%;
  }

  .btn {
    flex: 1;
  }

  .filters-bar {
    flex-direction: column;
  }

  .search-wrapper {
    min-width: unset;
    width: 100%;
  }

  .filter-select {
    width: 100%;
  }

  .quick-filters {
    justify-content: flex-start;
  }
}

/* Loading & Error States */
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  padding: 60px 20px;
  background: white;
  border-radius: 12px;
  border: 1px solid #E2E8F0;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #E2E8F0;
  border-top: 4px solid #2563EB;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.loading-container p {
  font-size: 14px;
  color: #64748B;
  font-weight: 500;
}

.error-container {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 20px;
  background: #FEE2E2;
  border: 1px solid #FECACA;
  border-radius: 12px;
  color: #DC2626;
}

.error-container p {
  margin: 0;
  font-weight: 500;
}

.error-container .btn {
  width: fit-content;
}
</style>
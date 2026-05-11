<template>
  <div class="patients-list-view">
    <!-- Header de la page -->
    <div class="page-title-bar">
      <div>
        <h1 class="page-title">Patients</h1>
        <p class="page-subtitle">
          {{ patients.length }} patients · {{ alertesCount }} avec alertes critiques
        </p>
      </div>
      <div class="page-actions">
        <button class="btn btn-secondary">
          📥 Export
        </button>
        <button class="btn btn-primary">
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
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'

import SearchInput from '@/components/ui/SearchInput.vue'
import FilterPill from '@/components/ui/FilterPill.vue'
import CategoryFilter from '@/components/ui/CategoryFilter.vue'
import PriorityFilter from '@/components/ui/PriorityFilter.vue'
import PatientsTable from '@/components/patients/PatientsTable.vue'
import Pagination from '@/components/ui/Pagination.vue'

import { mockPatients } from '@/data/mockPatients.js'
import { PATIENT_PROFILS } from '@/data/mockPatientProfils.js'

const router = useRouter()

const patients = ref(mockPatients)

// Filtres
const searchQuery = ref('')
const filterEtage = ref('')
const filterAS = ref('')
const filterCategory = ref(null)
const filterPriority = ref(null)
const filterQuick = ref('all')

// Tri
const sortKey = ref('chambre')
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

  // Filtre catégorie
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

// Reset page quand on filtre
watch([searchQuery, filterEtage, filterAS, filterCategory, filterPriority, filterQuick], () => {
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

const openPatient = (id) => {
  router.push(`/patients/${id}`)
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
</style>
<template>
  <div class="aides-view">
    <!-- Header de page -->
    <div class="page-title-bar">
      <div>
        <h1 class="page-title">Équipe Aides-Soignants</h1>
        <p class="page-subtitle">
          {{ aides.length }} AS actifs · Semaine {{ currentWeek }}
        </p>
      </div>
      <div class="page-actions">
        <button class="btn btn-primary" @click="isModalOpen = true">➕ Ajouter AS</button>
      </div>
    </div>

    <!-- Cards AS -->
    <div class="cards-grid">
      <ASCard
        v-for="as in aides"
        :key="as.id"
        :as="as"
        @click="openDetail(as)"
      />

      <!-- Card "Ajouter" -->
      <div class="add-card" @click="isModalOpen = true">
        <span class="add-icon">➕</span>
        <div class="add-label">Ajouter un AS</div>
      </div>
    </div>

    <!-- Recommandation d'équilibrage -->
    <div v-if="recommandation" class="reco-banner">
      <div class="reco-content">
        <div class="reco-header">
          <span class="reco-icon">⚠️</span>
          <span class="reco-title">Recommandation d'équilibrage</span>
        </div>
        <p class="reco-message">{{ recommandation.message }}</p>
        <div class="reco-suggestions">
          <strong>Suggestions :</strong>
          <ul>
            <li v-for="(suggestion, i) in recommandation.suggestions" :key="i">
              Transférer <strong>{{ suggestion.nbPatients }} patients</strong>
              de <strong>{{ suggestion.from }}</strong> vers
              <strong>{{ suggestion.to }}</strong>
              ({{ suggestion.gain }})
            </li>
          </ul>
        </div>
      </div>
      <button class="btn-reco">Voir suggestions de transfert</button>
    </div>

    <!-- Heatmap charge -->
    <SectionCard title="Heatmap charge — Semaine 19" icon="📅">
      <!-- Filtre Jour / Matin / Soir -->
      <div class="filter-buttons">
        <button
          :class="['filter-btn', { 'is-active': heatmapView === 'jour' }]"
          @click="heatmapView = 'jour'"
        >
          📅 Par jour
        </button>
        <button
          :class="['filter-btn', { 'is-active': heatmapView === 'matin' }]"
          @click="heatmapView = 'matin'"
        >
          🌅 Matin
        </button>
        <button
          :class="['filter-btn', { 'is-active': heatmapView === 'soir' }]"
          @click="heatmapView = 'soir'"
        >
          🌙 Soir
        </button>
      </div>
      <ChargeHeatmap
        :aides="aides"
        :charge="chargeAffichee"
        :show-values="true"
        :view-type="heatmapView"
      />
    </SectionCard>

    <!-- Modal détail -->
    <ASDetailModal
      v-if="modalAS"
      :as="modalAS"
      :charge-jour="modalChargeJour"
      :patients="modalPatients"
      @close="modalAS = null"
    />

    <!-- Modal Ajout -->
    <AddAideSoignantModal
      :is-open="isModalOpen"
      @close="isModalOpen = false"
      @created="onAideSoignantCreated"
    />

    <!-- Modal Gestion des absences -->
    <GererAbsencesModal
      :is-open="isAbsencesModalOpen"
      :aides="aides"
      @close="isAbsencesModalOpen = false"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

import { useAidesSoignants } from '@/composables/useAidesSoignants.js'
import { useAideSoignantCharge } from '@/composables/useAideSoignantCharge.js'
import { mockChargeJour, mockChargeJourPeriode, mockPatientsParAS } from '@/data/mockChargeJour.js'

import ASCard from '@/components/aides/ASCard.vue'
import ChargeHeatmap from '@/components/aides/ChargeHeatmap.vue'
import ASDetailModal from '@/components/aides/ASDetailModal.vue'
import AddAideSoignantModal from '@/components/forms/AddAideSoignantModal.vue'
import GererAbsencesModal from '@/components/GererAbsencesModal.vue'
import SectionCard from '@/components/ui/SectionCard.vue'

// Date de base pour le calcul des semaines
const baseWeekStart = new Date(2026, 4, 11)

// Composable pour charger les aides-soignants depuis l'API
const { aidesSoignants, loadAidesSoignants } = useAidesSoignants()

// Composable pour charger la charge d'un AS
const { plannings, chargeParJour, patientCount, loadChargeForAideSoignant } = useAideSoignantCharge()

const chargeJour = ref({})
const chargeJourPeriode = ref(mockChargeJourPeriode)
const patientsParAS = ref(mockPatientsParAS)
const modalAS = ref(null)
const modalChargeJour = ref({})
const modalPatients = ref([])
const isModalOpen = ref(false)
const isAbsencesModalOpen = ref(false)
const selectedAideSoignantId = ref(null)
const selectedAideSoignantNom = ref('')
const heatmapView = ref('jour') // 'jour', 'matin', 'soir'
const loading = ref(false)
const executions = ref([])
const asAlerts = ref([])

// Calculer la semaine actuelle
const calculateCurrentWeek = () => {
  const today = new Date()
  const dayDiff = Math.floor((today - baseWeekStart) / (24 * 60 * 60 * 1000))
  return 19 + Math.floor(dayDiff / 7)
}

const currentWeek = ref(calculateCurrentWeek())
const joursSemaine = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche']

/**
 * Formater une date pour l'affichage
 */
const formatDate = (dateString) => {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

/**
 * Charger les alertes des aides-soignants depuis l'API
 */
const loadAideSoignantAlerts = async () => {
  try {
    const response = await fetch('http://localhost:8081/api/alertes')
    const allAlerts = await response.json()
    
    // Filtrer les alertes AS_SURCHARGE et les enrichir avec le code de l'aide-soignant
    const enrichedAlerts = allAlerts
      .filter(alert => alert.type === 'AS_SURCHARGE')
      .map(alert => ({
        ...alert,
        aideSoignantCode: aidesSoignants.value.find(as => as.id === alert.aideSoignantId)?.code || 'AS-' + alert.aideSoignantId
      }))
    
    asAlerts.value = enrichedAlerts
  } catch (err) {
    console.error('Erreur lors du chargement des alertes AS:', err)
  }
}

/**
 * Calculer la charge par jour pour les ExecutionSoins d'une semaine
 */
const calculateChargeParJourFromExecutions = (executions, asCode, week) => {
  const days = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche']
  const chargeByDay = {}

  // Initialiser tous les jours
  days.forEach(day => {
    chargeByDay[day] = 0
  })

  // Filtrer les executions pour cet AS et cette semaine
  executions.forEach(execution => {
    if (execution.aideSoignant?.code !== asCode) return

    const execDate = new Date(execution.dateExecution + 'T00:00:00')
    const dayDiff = Math.floor((execDate - baseWeekStart) / (24 * 60 * 60 * 1000))
    const execWeek = 19 + Math.floor(dayDiff / 7)
    
    if (execWeek !== week) return

    const dayOfWeek = dayDiff % 7
    const day = days[dayOfWeek]
    
    // Durée par défaut = 30 min (à adapter selon le type de soin)
    chargeByDay[day] = (chargeByDay[day] || 0) + 30
  })

  return chargeByDay
}

/**
 * Charger la charge de tous les aides-soignants depuis les ExecutionSoins du backend
 */
const loadAllAidesSoignantCharges = async () => {
  loading.value = true
  const allCharges = {}

  try {
    // Récupérer tous les ExecutionSoins
    const response = await fetch('http://localhost:8081/api/executions')
    executions.value = await response.json()

    // Calculer la charge pour chaque AS
    aidesSoignants.value.forEach(as => {
      allCharges[as.code] = calculateChargeParJourFromExecutions(executions.value, as.code, currentWeek.value)
    })

    chargeJour.value = allCharges
  } catch (err) {
    console.error('Erreur lors du chargement des charges:', err)
  } finally {
    loading.value = false
  }
}

// Charger les aides-soignants et leur charge au montage
onMounted(async () => {
  await loadAidesSoignants()
  await loadAllAidesSoignantCharges()
  await loadAideSoignantAlerts()
})

// Données affichées selon le filtre
const chargeAffichee = computed(() => {
  if (heatmapView.value === 'jour') {
    return chargeJour.value
  }
  
  // Pour matin/soir, transformer les données de mockChargeJourPeriode
  const periode = heatmapView.value // 'matin' ou 'soir'
  const result = {}
  
  Object.entries(chargeJourPeriode.value).forEach(([as, jourData]) => {
    result[as] = {}
    Object.entries(jourData).forEach(([jour, periodeData]) => {
      result[as][jour] = periodeData[periode]
    })
  })
  
  return result
})

// Calcul des AS avec leur niveau
const aides = computed(() => {
  return aidesSoignants.value.map(as => {
    // Calculer la charge totale depuis chargeJour
    const charge = Object.values(chargeJour.value[as.code] || {}).reduce((sum, min) => sum + (min || 0), 0)
    let niveau = 'leger'
    if (charge >= 120) niveau = 'surcharge'
    else if (charge >= 90) niveau = 'eleve'
    else if (charge >= 60) niveau = 'normal'
    
    // Compter les patients et soins uniques pour cette semaine
    const execForThisAS = executions.value.filter(exec => {
      if (exec.aideSoignant?.code !== as.code) return false
      const execDate = new Date(exec.dateExecution + 'T00:00:00')
      const dayDiff = Math.floor((execDate - baseWeekStart) / (24 * 60 * 60 * 1000))
      const execWeek = 19 + Math.floor(dayDiff / 7)
      return execWeek === currentWeek.value
    })
    
    const uniquePatients = new Set(execForThisAS.map(e => e.patientId))
    
    return { 
      ...as, 
      niveau,
      chargeMinutes: charge,
      nbPatients: uniquePatients.size,
      nbSoins: execForThisAS.length
    }
  })
})

// Logique de recommandation d'équilibrage
const recommandation = computed(() => {
  const surcharges = aides.value.filter(as => as.niveau === 'surcharge')
  const sousCharges = aides.value.filter(as => as.niveau === 'leger')

  if (surcharges.length === 0) return null

  const surchargeAS = surcharges[0]
  const moyenne = aides.value.reduce((sum, as) => sum + as.chargeMinutes, 0) / aides.value.length

  return {
    message: `${surchargeAS.code} est surchargé (${surchargeAS.chargeMinutes} min, soit ${Math.round(((surchargeAS.chargeMinutes - moyenne) / moyenne) * 100)}% au-dessus de la moyenne). Considérez transférer 2-3 patients vers les AS les moins chargés pour rééquilibrer la charge.`,
    suggestions: sousCharges.slice(0, 2).map(as => {
      const ecart = surchargeAS.chargeMinutes - as.chargeMinutes
      return {
        from: surchargeAS.code,
        to: as.code,
        nbPatients: 2,
        gain: `réduit l'écart de ${Math.round(ecart / 2)}min`
      }
    })
  }
})

const openDetail = async (as) => {
  modalAS.value = as
  
  // Charger la charge réelle depuis l'API
  try {
    await loadChargeForAideSoignant(as.id)
    
    // Construire modalChargeJour à partir des données réelles
    const chargeByDay = {}
    const days = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']
    days.forEach(day => {
      chargeByDay[day] = chargeParJour.value[day] || 0
    })
    modalChargeJour.value = chargeByDay
    
    // Récupérer les patients uniques du planning
    const patients = new Map()
    plannings.value.forEach(planning => {
      if (planning.patientId && !patients.has(planning.patientId)) {
        patients.set(planning.patientId, {
          id: planning.patientId,
          nom: planning.patientNom || `Patient ${planning.patientId}`,
          chambre: planning.patientChambre || '-',
          soinsParSemaine: 0
        })
      }
    })
    
    // Compter les soins par patient
    plannings.value.forEach(planning => {
      if (planning.patientId && patients.has(planning.patientId)) {
        patients.get(planning.patientId).soinsParSemaine++
      }
    })
    
    modalPatients.value = Array.from(patients.values())
  } catch (err) {
    console.error('Erreur lors du chargement de la charge:', err)
  }
}

const openAbsencesModal = () => {
  isAbsencesModalOpen.value = true
  selectedAideSoignantId.value = null
  selectedAideSoignantNom.value = 'Tous les aides-soignants'
}

const onAideSoignantCreated = async (newAideSoignant) => {
  // L'AS a été ajouté au composable, recharger la liste et les charges
  await loadAidesSoignants()
  await loadAllAidesSoignantCharges()
  await loadAideSoignantAlerts()
}
</script>

<style scoped>
.aides-view {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 20px;
}

/* Page header */
.page-title-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.page-title {
  font-size: 24px;
  font-weight: 700;
  color: var(--color-text-primary);
  margin-bottom: 4px;
}

.page-subtitle {
  font-size: 13px;
  color: var(--color-text-secondary);
}

.page-actions {
  display: flex;
  gap: 8px;
}

.btn {
  padding: 9px 16px;
  border-radius: var(--radius-md);
  font-size: 13px;
  font-weight: 500;
  transition: all 0.15s ease;
}

.btn-secondary {
  background: white;
  border: 1px solid var(--color-border-light);
  color: var(--color-text-primary);
}

.btn-secondary:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
}

.btn-primary {
  background: var(--color-primary);
  color: white;
  border: 1px solid var(--color-primary);
}

.btn-primary:hover {
  background: var(--color-primary-dark);
}

/* Cards grid */
.cards-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

@media (max-width: 1024px) {
  .cards-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* Add card */
.add-card {
  background: var(--color-bg-secondary);
  border: 2px dashed var(--color-border);
  border-radius: var(--radius-lg);
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  min-height: 180px;
  transition: all 0.15s ease;
}

.add-card:hover {
  border-color: var(--color-primary);
  background: var(--color-primary-light);
}

.add-icon {
  font-size: 28px;
  color: var(--color-text-tertiary);
  margin-bottom: 8px;
}

.add-label {
  font-size: 13px;
  color: var(--color-text-secondary);
  font-weight: 500;
}

.add-card:hover .add-icon,
.add-card:hover .add-label {
  color: var(--color-primary);
}

/* Recommandation banner */
.reco-banner {
  background: var(--color-warning-light);
  border-left: 4px solid var(--color-warning);
  border-radius: var(--radius-md);
  padding: 16px 20px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
}

.reco-content {
  flex: 1;
}

.reco-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;
}

.reco-icon {
  font-size: 16px;
}

.reco-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--color-warning-dark);
}

.reco-message {
  font-size: 13px;
  color: var(--color-warning-dark);
  line-height: 1.5;
  margin-bottom: 10px;
}

.reco-suggestions {
  font-size: 12px;
  color: var(--color-warning-dark);
}

.reco-suggestions ul {
  list-style: none;
  padding: 0;
  margin-top: 6px;
}

.reco-suggestions li {
  padding: 3px 0;
  position: relative;
  padding-left: 16px;
}

.reco-suggestions li::before {
  content: '→';
  position: absolute;
  left: 0;
  font-weight: 700;
}

.btn-reco {
  background: var(--color-warning);
  color: white;
  padding: 8px 14px;
  border-radius: var(--radius-md);
  font-size: 12px;
  font-weight: 600;
  white-space: nowrap;
  transition: background 0.15s ease;
}

.btn-reco:hover {
  background: #D88B12;
}

/* Alertes des aides-soignants */
.alerts-section {
  background: white;
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-md);
  padding: 16px;
}

.alerts-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.alerts-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 0;
}

.alerts-count {
  background: #FFF3CD;
  color: #9A6C00;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
}

.alerts-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.alert-item {
  border-left: 4px solid;
  border-radius: 4px;
  padding: 12px;
  background: #F9F9F9;
  transition: all 0.15s ease;
}

.alert-item.alert-critique {
  border-left-color: #DC3545;
  background: #FFF5F5;
}

.alert-item.alert-moyen {
  border-left-color: #FFA500;
  background: #FFFBF5;
}

.alert-item.alert-bas {
  border-left-color: #FFD700;
  background: #FFFEF5;
}

.alert-content {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.alert-header-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 500;
  color: var(--color-text-primary);
}

.alert-emoji {
  font-size: 18px;
  min-width: 24px;
  text-align: center;
}

.alert-title-item {
  font-size: 14px;
  font-weight: 600;
}

.alert-as {
  background: #E8E8E8;
  color: #333;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
  margin-left: auto;
}

.alert-message {
  font-size: 13px;
  color: var(--color-text-secondary);
  margin: 0;
  line-height: 1.4;
}

.alert-meta {
  display: flex;
  gap: 12px;
  font-size: 11px;
  color: #999;
}

.alert-date {
  flex-grow: 1;
}

.alert-status {
  background: #FFE8E8;
  color: #DC3545;
  padding: 2px 6px;
  border-radius: 3px;
  font-weight: 500;
}

.alert-status.resolved {
  background: #D4EDDA;
  color: #155724;
}

/* Responsive */
@media (max-width: 768px) {
  .page-title-bar {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .page-actions {
    width: 100%;
    flex-direction: column;
  }

  .btn {
    width: 100%;
  }

  .cards-grid {
    grid-template-columns: 1fr;
  }

  .reco-banner {
    flex-direction: column;
    gap: 12px;
  }

  .btn-reco {
    width: 100%;
    text-align: center;
  }
}

/* Filter buttons */
.filter-buttons {
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
}

.filter-btn {
  padding: 8px 14px;
  border-radius: var(--radius-md);
  border: 1px solid var(--color-border);
  background: white;
  color: var(--color-text-secondary);
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s ease;
}

.filter-btn:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
}

.filter-btn.is-active {
  background: var(--color-primary);
  color: white;
  border-color: var(--color-primary);
}
</style>

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
        @delete="confirmDeleteAS"
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
      
    </div>

    <!-- Heatmap charge -->
    <SectionCard :title="`Heatmap charge — Semaine ${currentWeek}`" icon="📅">
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
import apiClient from '@/api/client.js'
import { getCurrentWeekMonday, getISOWeekNumber, getDayIndexInCurrentWeek } from '@/utils/dateUtils.js'

import ASCard from '@/components/aides/ASCard.vue'
import ChargeHeatmap from '@/components/aides/ChargeHeatmap.vue'
import ASDetailModal from '@/components/aides/ASDetailModal.vue'
import AddAideSoignantModal from '@/components/forms/AddAideSoignantModal.vue'
import GererAbsencesModal from '@/components/GererAbsencesModal.vue'
import SectionCard from '@/components/ui/SectionCard.vue'

const currentMondayStr = getCurrentWeekMonday()

// Composable pour charger les aides-soignants depuis l'API
const { aidesSoignants, loadAidesSoignants, deleteAideSoignant } = useAidesSoignants()

const chargeJour = ref({})
const chargeJourPeriode = ref({})
const patientsParAS = ref({})
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

const currentWeek = ref(getISOWeekNumber())

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
    const allAlerts = await apiClient.get('/alertes')
    
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

const joursSemaineKeys = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche']

const getExecDuree = (execution) => {
  const match = execution.commentaire?.match(/Dur[ée]+:\s*(\d+)/)
  return parseInt(match?.[1] || '30')
}

// Filtre les exécutions d'un AS pour la semaine donnée,
// EN DÉDUPLIQUANT par (patientId + jour + typeSoinId) — même logique que la page Activités.
const getDeduplicatedExecs = (execs, asCode) => {
  const seen = new Set()
  const result = []
  execs.forEach(exec => {
    if (exec.aideSoignant?.code !== asCode) return
    const dayDiff = getDayIndexInCurrentWeek(exec.dateExecution, currentMondayStr)
    if (dayDiff === -1) return
    const key = `${exec.patientId}_${dayDiff}_${exec.typeSoinId}`
    if (seen.has(key)) return
    seen.add(key)
    result.push({ exec, dayDiff })
  })
  return result
}

// Charge totale par jour (pour heatmap "Par jour")
const calculateChargeParJourFromExecutions = (execs, asCode) => {
  const chargeByDay = {}
  joursSemaineKeys.forEach(d => { chargeByDay[d] = 0 })
  getDeduplicatedExecs(execs, asCode).forEach(({ exec, dayDiff }) => {
    const day = joursSemaineKeys[dayDiff % 7]
    chargeByDay[day] = (chargeByDay[day] || 0) + getExecDuree(exec)
  })
  return chargeByDay
}

// Charge séparée matin/soir par jour (pour heatmap "Matin" et "Soir")
const calculateChargeParPeriodeFromExecutions = (execs, asCode) => {
  const chargeByDay = {}
  joursSemaineKeys.forEach(d => { chargeByDay[d] = { matin: 0, soir: 0 } })
  getDeduplicatedExecs(execs, asCode).forEach(({ exec, dayDiff }) => {
    const day = joursSemaineKeys[dayDiff % 7]
    const hour = parseInt(exec.heureExecution?.split(':')[0] || '8')
    const periode = hour >= 14 ? 'soir' : 'matin'
    chargeByDay[day][periode] = (chargeByDay[day][periode] || 0) + getExecDuree(exec)
  })
  return chargeByDay
}

const loadAllAidesSoignantCharges = async () => {
  loading.value = true
  try {
    executions.value = await apiClient.get('/executions')

    const allCharges = {}
    const allChargesPeriode = {}
    aidesSoignants.value.forEach(as => {
      allCharges[as.code] = calculateChargeParJourFromExecutions(executions.value, as.code)
      allChargesPeriode[as.code] = calculateChargeParPeriodeFromExecutions(executions.value, as.code)
    })

    chargeJour.value = allCharges
    chargeJourPeriode.value = allChargesPeriode
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
  
  // Pour matin/soir, transformer les données réelles par période
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
    
    // Compter les patients et soins dédupliqués pour cette semaine
    const execForThisAS = getDeduplicatedExecs(executions.value, as.code, currentWeek.value).map(({ exec }) => exec)
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

const openDetail = (as) => {
  modalAS.value = as

  // Charge par jour — utilise chargeJour déjà calculé depuis les executions
  // Les clés sont 'lundi','mardi'... comme attendu par ASDetailModal.jourLabel
  modalChargeJour.value = chargeJour.value[as.code] || {
    lundi: 0, mardi: 0, mercredi: 0, jeudi: 0, vendredi: 0, samedi: 0, dimanche: 0
  }

  // Patients — depuis les executions dédupliquées de la semaine
  const patientsMap = new Map()
  getDeduplicatedExecs(executions.value, as.code).forEach(({ exec }) => {
    const patientId = exec.patientId
    if (!patientsMap.has(patientId)) {
      const p = aidesSoignants.value  // fallback si patients pas chargés séparément
      // chercher dans les exécutions les infos patient
      const nom = exec.patient
        ? `${exec.patient.prenom || ''} ${exec.patient.nom || ''}`.trim()
        : `Patient ${patientId}`
      const chambre = exec.patient?.numeroChambre || '-'
      patientsMap.set(patientId, { id: patientId, nom, chambre, soinsParSemaine: 0 })
    }
    patientsMap.get(patientId).soinsParSemaine++
  })
  modalPatients.value = Array.from(patientsMap.values())
}

const openAbsencesModal = () => {
  isAbsencesModalOpen.value = true
  selectedAideSoignantId.value = null
  selectedAideSoignantNom.value = 'Tous les aides-soignants'
}

const confirmDeleteAS = async (as) => {
  const soins = as.nbSoins || 0
  const msg = soins > 0
    ? `Supprimer ${as.code} ? Cet AS a ${soins} soin(s) planifié(s) cette semaine. Cette action est irréversible.`
    : `Supprimer l'aide-soignant ${as.code} ? Cette action est irréversible.`
  if (!confirm(msg)) return

  try {
    await deleteAideSoignant(as.id)
    await loadAllAidesSoignantCharges()
  } catch (err) {
    alert(`Erreur lors de la suppression : ${err.message}`)
  }
}

const onAideSoignantCreated = async (newAideSoignant) => {
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

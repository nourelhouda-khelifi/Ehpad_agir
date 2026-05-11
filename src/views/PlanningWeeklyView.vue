<template>
  <div class="planning-view">
    <div class="page-title-bar">
      <div>
        <h1 class="page-title">Planning des activités</h1>
        <p class="page-subtitle">{{ weekLabel }}</p>
      </div>
      <div class="page-actions">
        <button class="btn btn-secondary" @click="previousWeek">‹ Précédent</button>
        <button class="btn btn-secondary" @click="goToCurrentWeek">Cette semaine</button>
        <button class="btn btn-secondary" @click="nextWeek">Suivant ›</button>
        <button class="btn btn-primary">📥 Export</button>
      </div>
    </div>

    <!-- Filtre d'activité -->
    <div class="activity-filter-bar">
      <span class="filter-label">Activité :</span>
      <div class="activity-pills">
        <button
          v-for="(config, key) in activitiesConfig"
          :key="key"
          class="activity-pill"
          :class="{ 'is-active': selectedActivity === key }"
          @click="selectedActivity = key"
          :style="{ borderColor: config.color, backgroundColor: selectedActivity === key ? config.color + '20' : 'transparent' }"
        >
          {{ config.icon }} {{ config.label }}
        </button>
      </div>
    </div>

    <div class="filters-bar">
      <FilterPill :active="filterEtage === 'all'" :count="patients.length" @click="filterEtage = 'all'">
        Tous les étages
      </FilterPill>
      <FilterPill :active="filterEtage === '1'" :count="countEtage(1)" @click="filterEtage = '1'">
        1er étage
      </FilterPill>
      <FilterPill :active="filterEtage === '2'" :count="countEtage(2)" @click="filterEtage = '2'">
        2ème étage
      </FilterPill>
      <FilterPill :active="filterEtage === '3'" :count="countEtage(3)" @click="filterEtage = '3'">
        3ème étage
      </FilterPill>
      <FilterPill :active="filterAS === 'all'" :count="patients.length" @click="filterAS = 'all'">
        Tous les AS
      </FilterPill>
      <FilterPill
        v-for="code in aidesCodes"
        :key="code"
        :active="filterAS === code"
        :count="countByAS(code)"
        @click="filterAS = code"
      >
        {{ code }}
      </FilterPill>
      <FilterPill :active="filterSansDouche" :count="patientsWithoutActivity.length" variant="danger" @click="filterSansDouche = !filterSansDouche">
        ⚠️ Sans {{ activitiesConfig[selectedActivity].label.toLowerCase() }}
      </FilterPill>
    </div>

    <div class="as-charges-summary">
      <div
        v-for="as in aidesSoignantsAvecCharge"
        :key="as.id"
        class="charge-mini"
        :class="`niveau-${as.niveau}`"
      >
        <div class="charge-mini-head">
          <ASBadge :code="as.code" />
          <span class="charge-mini-value">{{ as.chargeMinutes }} min</span>
        </div>
        <ChargeBar :minutes="as.chargeMinutes" />
        <div class="charge-mini-meta">{{ as.nbDouches }} douche(s) · {{ as.nbPatients }} patient(s)</div>
      </div>
    </div>

    <div class="planning-grid-card">
      <div class="planning-grid">
        <div class="grid-header">
          <div class="grid-cell-header">Patient</div>
          <div v-for="jour in jours" :key="jour.key" class="grid-cell-header">
            <span class="jour-label">{{ jour.short }}</span>
            <span class="jour-date">{{ jour.date }}</span>
          </div>
        </div>

        <div v-if="patientsFiltres.length === 0" class="empty-state">
          <span class="empty-icon">🔍</span>
          <p>Aucun patient ne correspond aux filtres</p>
        </div>

        <div
          v-for="patient in patientsFiltres"
          :key="patient.id"
          class="grid-row"
          :class="[
            `etage-${patient.etage}`,
            { 'is-warning': isPatientSansDouche(patient.id) }
          ]"
        >
          <div class="patient-cell">
            <div class="patient-name" :class="{ 'has-warning': isPatientSansDouche(patient.id) }">
              <span v-if="isPatientSansDouche(patient.id)" class="warning-icon">⚠️</span>
              {{ formatName(patient) }}
            </div>
            <div class="patient-room">
              {{ patient.chambre }}
              <span v-if="isPatientSansDouche(patient.id)" class="warning-text">— sans {{ activitiesConfig[selectedActivity].label.toLowerCase() }}</span>
            </div>
          </div>

          <PlanningCell
            v-for="jour in jours"
            :key="jour.key"
            :as-code="currentPlanning[patient.id]?.[jour.key]?.as"
            :is-warning="isPatientSansDouche(patient.id) && !currentPlanning[patient.id]?.[jour.key]?.as"
            @click="openModal(patient, jour.key)"
          />
        </div>
      </div>
    </div>

    <ASSelectorModal
      v-if="modalOpen && modalPatient"
      :patient-nom="formatName(modalPatient)"
      :jour="modalJour"
      :semaine="currentWeek"
      :as-actuel="currentPlanning[modalPatient.id]?.[modalJour]?.as"
      :aides-avec-charge="aidesSoignantsAvecCharge"
      :recommandation="recommanderAS"
      @close="closeModal"
      @confirm="handleAssign"
      @remove="handleRemove"
    />
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import FilterPill from '@/components/ui/FilterPill.vue'
import ASBadge from '@/components/ui/ASBadge.vue'
import ChargeBar from '@/components/ui/ChargeBar.vue'
import PlanningCell from '@/components/planning/PlanningCell.vue'
import ASSelectorModal from '@/components/planning/ASSelectorModal.vue'
import { mockPatients } from '@/data/mockPatients.js'
import { mockAidesSoignants } from '@/data/mockAides.js'
import { clonePlanning, createEmptyPlanningForPatients, mockPlanningSemaine19 } from '@/data/mockPlanning.js'
import { useCharge } from '@/composables/useCharge.js'

const patients = ref(mockPatients)
const planningByWeek = ref({
  19: clonePlanning(mockPlanningSemaine19)
})

const currentWeek = ref(19)
const filterEtage = ref('all')
const filterAS = ref('all')
const filterSansDouche = ref(false)
const selectedActivity = ref('douche')
const modalOpen = ref(false)
const modalPatient = ref(null)
const modalJour = ref(null)

// Configuration des activités
const activitiesConfig = ref({
  douche: { icon: '🛁', label: 'Douche', color: '#3B82F6' },
  wc: { icon: '🚽', label: 'WC', color: '#8B5CF6' },
  toilette: { icon: '🚿', label: 'Toilette', color: '#06B6D4' },
  coucher: { icon: '🌙', label: 'Coucher', color: '#F59E0B' },
  repas: { icon: '🍽️', label: 'Repas', color: '#10B981' }
})

const baseWeekStart = new Date(2026, 4, 11)
const joursSemaine = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche']
const jours = computed(() => {
  return joursSemaine.map((key, index) => {
    const date = new Date(baseWeekStart)
    date.setDate(baseWeekStart.getDate() + index + (currentWeek.value - 19) * 7)

    return {
      key,
      short: date.toLocaleDateString('fr-FR', { weekday: 'short' }).replace('.', ''),
      date: date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })
    }
  })
})

const ensurePlanningForWeek = (week) => {
  if (!planningByWeek.value[week]) {
    planningByWeek.value[week] = createEmptyPlanningForPatients(patients.value)
  }
}

watch(currentWeek, (week) => {
  ensurePlanningForWeek(week)
}, { immediate: true })

const currentPlanning = computed(() => planningByWeek.value[currentWeek.value])
const { aidesSoignantsAvecCharge, recommanderAS } = useCharge(currentPlanning)
const aidesCodes = computed(() => mockAidesSoignants.map((as) => as.code))

const weekLabel = computed(() => {
  const start = new Date(baseWeekStart)
  start.setDate(baseWeekStart.getDate() + (currentWeek.value - 19) * 7)
  const end = new Date(start)
  end.setDate(start.getDate() + 6)
  return `Semaine ${currentWeek.value} · Du ${start.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })} au ${end.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}`
})

const formatName = (patient) => {
  if (!patient) return ''
  const title = patient.prenom ? 'Mme ' : 'Mr/Mme '
  return `${title}${patient.nom}${patient.prenom ? ` ${patient.prenom}` : ''}`
}

const countEtage = (etage) => patients.value.filter((patient) => patient.etage === etage).length

const rowHasAS = (patientId, asCode) => {
  const planningPatient = currentPlanning.value[patientId]
  if (!planningPatient) return false
  return Object.values(planningPatient).some(cell => {
    const cellAS = typeof cell === 'string' ? cell : cell?.as
    return cellAS === asCode
  })
}

const isPatientSansDouche = (patientId) => {
  const planningPatient = currentPlanning.value[patientId]
  if (!planningPatient) return true
  return Object.values(planningPatient).every((cell) => !cell || !cell.activity || cell.activity !== selectedActivity.value)
}

const patientsWithoutActivity = computed(() => {
  return patients.value.filter((patient) => {
    if (!isPatientSansDouche(patient.id)) return false
    if (filterEtage.value !== 'all' && patient.etage !== Number(filterEtage.value)) return false
    if (filterAS.value !== 'all' && patient.asReferent !== filterAS.value) return false
    return true
  })
})

const countByAS = (asCode) => {
  return patients.value.filter((patient) => rowHasAS(patient.id, asCode)).length
}

const sansDoucheCount = computed(() => patients.value.filter((patient) => isPatientSansDouche(patient.id)).length)

const patientsFiltres = computed(() => {
  return patients.value.filter((patient) => {
    if (filterEtage.value !== 'all' && patient.etage !== Number(filterEtage.value)) {
      return false
    }

    if (filterSansDouche.value && !isPatientSansDouche(patient.id)) {
      return false
    }

    if (filterAS.value !== 'all' && !rowHasAS(patient.id, filterAS.value) && patient.asReferent !== filterAS.value) {
      return false
    }

    return true
  })
})

const previousWeek = () => {
  currentWeek.value -= 1
}

const nextWeek = () => {
  currentWeek.value += 1
}

const goToCurrentWeek = () => {
  currentWeek.value = 19
}

const openModal = (patient, jour) => {
  modalPatient.value = patient
  modalJour.value = jour
  modalOpen.value = true
}

const closeModal = () => {
  modalOpen.value = false
  modalPatient.value = null
  modalJour.value = null
}

const ensurePatientPlanning = (patientId) => {
  if (!currentPlanning.value[patientId]) {
    currentPlanning.value[patientId] = joursSemaine.reduce((acc, jour) => {
      acc[jour] = { as: null, activity: null }
      return acc
    }, {})
  }
}

const handleAssign = (codeAS) => {
  if (!modalPatient.value || !modalJour.value) return
  ensurePatientPlanning(modalPatient.value.id)
  currentPlanning.value[modalPatient.value.id][modalJour.value] = { as: codeAS, activity: selectedActivity.value }
  closeModal()
}

const handleRemove = () => {
  if (!modalPatient.value || !modalJour.value) return
  ensurePatientPlanning(modalPatient.value.id)
  currentPlanning.value[modalPatient.value.id][modalJour.value] = { as: null, activity: null }
  closeModal()
}
</script>

<style scoped>
.planning-view {
  display: flex;
  flex-direction: column;
  gap: 18px;
  padding: 20px 24px 28px;
  animation: fadeIn var(--transition-base) ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.page-title-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
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
  flex-wrap: wrap;
}

.btn {
  padding: 9px 14px;
  border-radius: var(--radius-md);
  font-size: 13px;
  font-weight: 600;
  transition: all var(--transition-base);
  cursor: pointer;
  box-shadow: var(--shadow-xs);
}

.btn:hover {
  transform: translateY(-1px);
  box-shadow: var(--shadow-sm);
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
  background: linear-gradient(135deg, var(--color-primary) 0%, #1D4ED8 100%);
  color: white;
  border: 1px solid var(--color-primary);
}

.filters-bar {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

/* Activity filter bar */
.activity-filter-bar {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 14px;
  background: white;
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-lg);
  flex-wrap: wrap;
  box-shadow: var(--shadow-xs);
}

.filter-label {
  font-size: 12px;
  font-weight: 600;
  color: var(--color-text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.activity-pills {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.activity-pill {
  padding: 6px 12px;
  border: 1.5px solid var(--color-border-light);
  border-radius: 20px;
  background: white;
  color: var(--color-text-primary);
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s ease;
  white-space: nowrap;
}

.activity-pill:hover {
  border-color: var(--color-primary);
  background: rgba(37, 99, 235, 0.05);
}

.activity-pill.is-active {
  background: var(--color-primary);
  color: white;
  border-color: var(--color-primary);
}

.as-charges-summary {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 12px;
}

.charge-mini {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 14px;
  border-radius: var(--radius-lg);
  background: white;
  border: 1px solid var(--color-border-light);
  box-shadow: var(--shadow-sm);
}

.charge-mini-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

.charge-mini-value {
  font-size: 16px;
  font-weight: 700;
  color: var(--color-text-primary);
}

.charge-mini-meta {
  font-size: 11px;
  color: var(--color-text-secondary);
}

.charge-mini.niveau-leger {
  background: linear-gradient(135deg, #F0FDF4 0%, #DCFCE7 100%);
}

.charge-mini.niveau-normal {
  background: linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%);
}

.charge-mini.niveau-eleve {
  background: linear-gradient(135deg, #FFEDD5 0%, #FED7AA 100%);
}

.charge-mini.niveau-surcharge {
  background: linear-gradient(135deg, #FEE2E2 0%, #FECACA 100%);
}

.planning-grid-card {
  background: white;
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-border-light);
  box-shadow: var(--shadow-sm);
  overflow: hidden;
}

.planning-grid {
  min-width: 960px;
}

.grid-header,
.grid-row {
  display: grid;
  grid-template-columns: 240px repeat(7, minmax(0, 1fr));
}

.grid-header {
  background: linear-gradient(135deg, #F8FAFC 0%, #EFF6FF 100%);
  font-size: 12px;
  font-weight: 700;
  color: var(--color-text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.grid-cell-header {
  padding: 14px 12px;
  text-align: center;
  border-left: 1px solid var(--color-border-light);
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.grid-cell-header:first-child {
  text-align: left;
  border-left: none;
}

.jour-label {
  font-size: 12px;
}

.jour-date {
  font-size: 10px;
  font-weight: 600;
  color: var(--color-text-tertiary);
}

.grid-row {
  border-top: 1px solid var(--color-border-light);
  transition: background var(--transition-base);
}

.grid-row:hover {
  box-shadow: inset 0 0 0 9999px rgba(37, 99, 235, 0.02);
}

.etage-1 {
  background: linear-gradient(90deg, #FFFCE6 0%, #FFFDF2 100%);
}

.etage-2 {
  background: linear-gradient(90deg, #FFEDD5 0%, #FFF7ED 100%);
}

.etage-3 {
  background: linear-gradient(90deg, #FCE7F3 0%, #FFF1F2 100%);
}

.grid-row.is-warning {
  background: linear-gradient(90deg, rgba(226, 75, 74, 0.08) 0%, rgba(226, 75, 74, 0.04) 100%);
}

.patient-cell {
  padding: 12px 14px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  justify-content: center;
}

.patient-name {
  font-size: 13px;
  font-weight: 700;
  color: var(--color-text-primary);
  display: flex;
  align-items: center;
  gap: 6px;
}

.patient-name.has-warning {
  color: var(--color-danger-dark);
}

.warning-icon {
  font-size: 12px;
}

.patient-room {
  font-size: 11px;
  color: var(--color-text-secondary);
}

.warning-text {
  color: var(--color-danger-dark);
  font-style: italic;
}

.empty-state {
  padding: 48px 20px;
  text-align: center;
  color: var(--color-text-secondary);
  grid-column: 1 / -1;
}

.empty-icon {
  font-size: 32px;
  display: block;
  margin-bottom: 10px;
}

@media (max-width: 1280px) {
  .as-charges-summary {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 1024px) {
  .page-title-bar {
    flex-direction: column;
    align-items: flex-start;
  }

  .planning-grid {
    min-width: 900px;
  }
}

@media (max-width: 768px) {
  .planning-view {
    padding: 16px;
  }

  .as-charges-summary {
    grid-template-columns: 1fr;
  }
}
</style>

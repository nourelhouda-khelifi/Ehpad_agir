<template>
  <div class="planning-view">
    <div class="page-title-bar">
      <div>
        <h1 class="page-title">Planning des activités</h1>
        <p class="page-subtitle">{{ weekLabel }}</p>
      </div>
      <div class="page-actions">
        <CalendarWeekSelector v-model="currentWeekMonday" />
        
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
          :style="selectedActivity === key
            ? { borderColor: config.color, backgroundColor: config.color, color: 'white', boxShadow: `0 4px 14px ${config.color}55` }
            : { borderColor: `${config.color}55`, color: config.color }"
        >
          <span class="activity-dot" :style="selectedActivity === key ? { background: 'rgba(255,255,255,0.4)' } : { background: config.color }"></span>
          {{ config.label }}
        </button>
      </div>
    </div>

    <!-- Recherche patient -->
    <div class="search-bar">
      <span class="search-icon">🔍</span>
      <input
        v-model="searchQuery"
        type="text"
        class="search-input"
        placeholder="Rechercher par nom, prénom ou chambre..."
        autocomplete="off"
      />
      <button v-if="searchQuery" class="search-clear" @click="searchQuery = ''">✕</button>
    </div>

    <div class="filters-bar">
      <div class="filter-group">
        <span class="filter-group-label">Étage</span>
        <FilterPill :active="filterEtage === 'all'" :count="patients.length" @click="filterEtage = 'all'">Tous</FilterPill>
        <FilterPill :active="filterEtage === '1'" :count="countEtage(1)" @click="filterEtage = '1'">1er</FilterPill>
        <FilterPill :active="filterEtage === '2'" :count="countEtage(2)" @click="filterEtage = '2'">2ème</FilterPill>
        <FilterPill :active="filterEtage === '3'" :count="countEtage(3)" @click="filterEtage = '3'">3ème</FilterPill>
      </div>

      <div class="filter-sep"></div>

      <div class="filter-group">
        <span class="filter-group-label">Aide-Soignant</span>
        <FilterPill :active="filterAS === 'all'" :count="patients.length" @click="filterAS = 'all'">Tous</FilterPill>
        <FilterPill
          v-for="code in aidesCodes"
          :key="code"
          :active="filterAS === code"
          :count="countByAS(code)"
          @click="filterAS = code"
        >{{ code }}</FilterPill>
      </div>

      <div class="filter-sep"></div>

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
        :style="{ borderTop: `3px solid ${getASColor(as.code)}` }"
      >
        <div class="charge-mini-head">
          <ASBadge :code="as.code" />
          <span class="charge-mini-value">{{ as.chargeMinutes }} min</span>
        </div>
        <ChargeBar :minutes="as.chargeMinutes" />
        <div class="charge-mini-meta">{{ as.nbActivites }} activité(s) · {{ as.nbPatients }} patient(s)</div>
      </div>
    </div>

    <!-- Onglets sous-groupes coucher -->
    <div v-if="selectedActivity === 'coucher'" class="coucher-tabs">
      <button
        class="coucher-tab"
        :class="{ 'is-active': coucherTab === 'HELIOS' }"
        @click="coucherTab = 'HELIOS'"
      >
        🌙 Hélios
        <span class="coucher-tab-time">18:30 – 19:30</span>
        <span class="coucher-tab-count">{{ countGroupeCoucher('HELIOS') }} patients</span>
      </button>
      <button
        class="coucher-tab"
        :class="{ 'is-active': coucherTab === 'GRANDE_SALLE' }"
        @click="coucherTab = 'GRANDE_SALLE'"
      >
        🍽️ Grande Salle à Manger
        <span class="coucher-tab-time">19:30 – 20:30</span>
        <span class="coucher-tab-count">{{ countGroupeCoucher('GRANDE_SALLE') }} patients</span>
      </button>
    </div>

    <div class="planning-grid-card">
      <div class="planning-grid">
        <div class="grid-header">
          <div class="grid-cell-header">Patient</div>
          <div v-for="jour in jours" :key="jour.key" class="grid-cell-header" :class="{ 'is-today': jour.isToday }">
            <span class="jour-label">{{ jour.short }}</span>
            <span class="jour-date">{{ jour.date }}</span>
            <span v-if="jour.isToday" class="today-dot"></span>
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
          :style="{ borderLeftColor: getCategoryColor(patient.categorie), borderLeftWidth: '3px' }"
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
            :as-code="getCellActivityData(currentPlanning?.[patient.id]?.[jour.key]?.[selectedActivity])?.as || null"
            :duree="getCellActivityData(currentPlanning?.[patient.id]?.[jour.key]?.[selectedActivity])?.duree"
            :moment="getCellActivityData(currentPlanning?.[patient.id]?.[jour.key]?.[selectedActivity])?.moment"
            :activity-data="getCellActivityData(currentPlanning?.[patient.id]?.[jour.key]?.[selectedActivity])"
            :is-warning="isPatientSansDouche(patient.id) && !currentPlanning?.[patient.id]?.[jour.key]?.[selectedActivity]?.as && currentPlanning?.[patient.id]?.[jour.key]?.[selectedActivity]?.type !== 'shared'"
            @click="openModal(patient, jour.key)"
          />
        </div>
      </div>
    </div>

    <ASSelectorModal
      v-if="modalOpen && modalPatient"
      :patient-nom="formatName(modalPatient)"
      :jour="modalJour"
      :semaine="currentWeekMonday"
      :activite="selectedActivity"
      :as-actuel="currentPlanning?.[modalPatient.id]?.[modalJour]?.[selectedActivity]?.as"
      :duree-actuelle="currentPlanning?.[modalPatient.id]?.[modalJour]?.[selectedActivity]?.duree || (selectedActivity === 'douche' ? 30 : null)"
      :moment-actuel="currentPlanning?.[modalPatient.id]?.[modalJour]?.[selectedActivity]?.moment || 'matin'"
      :aides-avec-charge="aidesSoignantsAvecCharge"
      :recommandation="recommanderAS"
      @close="closeModal"
      @confirm="handleAssign"
      @remove="handleRemove"
    />
  </div>
</template>

<script setup>
import { computed, ref, watch, onMounted } from 'vue'
import FilterPill from '@/components/ui/FilterPill.vue'
import ASBadge from '@/components/ui/ASBadge.vue'
import ChargeBar from '@/components/ui/ChargeBar.vue'
import CalendarWeekSelector from '@/components/ui/CalendarWeekSelector.vue'
import PlanningCell from '@/components/planning/PlanningCell.vue'
import ASSelectorModal from '@/components/planning/ASSelectorModal.vue'
import { PATIENT_CATEGORIES } from '@/constants/patientConfig.js'
import { useCharge } from '@/composables/useCharge.js'
import apiClient from '@/api/client.js'

// Mapping activité frontend → code TypeSoin backend
const ACTIVITY_TO_CODE = {
  petitDejeuner: 'PETIT_DEJEUNER',
  douche:        'DOUCHE',
  toilette:      'TOILETTE',
  wc:            'MISE_WC',
  lever:         'LEVER',
  sieste:        'SIESTE',
  coucher:       'COUCHER',
  repas:         'AIDE_REPAS',
}

const patients = ref([])
const aidesSoignants = ref([])
const planningByWeek = ref({})
const activityToTypeSoinId = ref({}) // { douche: 2, toilette: 1, ... }
const typeSoinIdToActivity = ref({}) // { 2: 'douche', ... }
const loadedWeeks = new Set() // cache des semaines déjà chargées

// ─── Helpers dates ──────────────────────────────────────────────────────────

const toISO = (d) => d.toLocaleDateString('en-CA') // → YYYY-MM-DD

const getISOMonday = (date = new Date()) => {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  const day = d.getDay()
  d.setDate(d.getDate() - (day === 0 ? 6 : day - 1))
  return toISO(d)
}

// Semaine courante = ISO date du lundi
const currentWeekMonday = ref(getISOMonday())
// Clé d'accès dans planningByWeek (= currentWeekMonday)
const weekKey = computed(() => currentWeekMonday.value)
const filterEtage = ref('all')
const filterAS = ref('all')
const filterSansDouche = ref(false)
const searchQuery = ref('')
const selectedActivity = ref('douche')
const modalOpen = ref(false)
const modalPatient = ref(null)
const modalJour = ref(null)

// Configuration des activités (ordre d'affichage)
const activitiesConfig = ref({
  petitDejeuner: { icon: '🥐', label: 'Petit déjeuner', color: '#F59E0B' },
  douche:        { icon: '🛁', label: 'Douche',         color: '#3B82F6' },
  toilette:      { icon: '🚿', label: 'Toilette',       color: '#06B6D4' },
  wc:            { icon: '🚽', label: 'Mise WC',        color: '#8B5CF6' },
  lever:         { icon: '⬆️', label: 'Lever',          color: '#EC4899' },
  sieste:        { icon: '😴', label: 'Sieste',         color: '#64748B' },
  coucher:       { icon: '🌙', label: 'Coucher',        color: '#F59E0B' },
})

// Sous-onglet actif pour le coucher
const coucherTab = ref('HELIOS') // 'HELIOS' | 'GRANDE_SALLE'

const joursSemaine = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche']
const jours = computed(() => {
  const [y, m, d] = currentWeekMonday.value.split('-').map(Number)
  const monday = new Date(y, m - 1, d)
  const todayISO = toISO(new Date())
  return joursSemaine.map((key, i) => {
    const date = new Date(monday)
    date.setDate(monday.getDate() + i)
    return {
      key,
      short: date.toLocaleDateString('fr-FR', { weekday: 'short' }).replace('.', ''),
      date: date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }),
      isToday: toISO(date) === todayISO
    }
  })
})

const getASColor = (code) => aidesSoignants.value.find(a => a.code === code)?.color || '#6B7280'

const countGroupeCoucher = (groupe) =>
  patients.value.filter(p => p.groupeCoucher === groupe).length

// ─── Helpers ───────────────────────────────────────────────────────────────

const ensureWeek = (key) => {
  if (!planningByWeek.value[key]) planningByWeek.value[key] = {}
}

// ─── Chargement API ─────────────────────────────────────────────────────────

const buildPlanningFromExecutions = (executions, mondayStr) => {
  const [y, m, d] = mondayStr.split('-').map(Number)
  const monday = new Date(y, m - 1, d)
  monday.setHours(0, 0, 0, 0)

  executions.forEach(execution => {
    const execDate = new Date(execution.dateExecution + 'T00:00:00')
    execDate.setHours(0, 0, 0, 0)
    const dayDiff = Math.round((execDate - monday) / (24 * 60 * 60 * 1000))
    if (dayDiff < 0 || dayDiff > 6) return

    const activity = typeSoinIdToActivity.value[execution.typeSoinId]
    if (!activity) return

    const hour = parseInt(execution.heureExecution?.split(':')[0] || '8')
    let moment = 'matin'
    if (hour >= 19) moment = '19-20'
    else if (hour >= 18) moment = '18-19'
    else if (hour >= 14) moment = 'soir'

    const patientId = execution.patientId
    const jour = joursSemaine[dayDiff]
    const duree = parseInt(execution.commentaire?.match(/Dur[ée]+: (\d+)/)?.[1] || '30')

    if (!planningByWeek.value[mondayStr][patientId]) planningByWeek.value[mondayStr][patientId] = {}
    if (!planningByWeek.value[mondayStr][patientId][jour]) planningByWeek.value[mondayStr][patientId][jour] = {}

    const existing = planningByWeek.value[mondayStr][patientId][jour][activity]
    const asCode = execution.aideSoignant?.code

    if (existing?._execId && asCode && existing.as !== asCode) {
      planningByWeek.value[mondayStr][patientId][jour][activity] = {
        type: 'shared',
        ases: [existing.as, asCode],
        durees: [existing.duree || 30, duree],
        moment: existing.moment || moment,
        _execIds: [existing._execId, execution.id]
      }
    } else if (!existing) {
      planningByWeek.value[mondayStr][patientId][jour][activity] = {
        as: asCode, duree, moment, _execId: execution.id
      }
    }
  })
}

const loadWeekExecutions = async (mondayStr) => {
  if (loadedWeeks.has(mondayStr)) return
  loadedWeeks.add(mondayStr)
  ensureWeek(mondayStr)

  const [y, m, d] = mondayStr.split('-').map(Number)
  const endDate = toISO(new Date(y, m - 1, d + 6))

  try {
    const executions = await apiClient.get(`/executions/range?startDate=${mondayStr}&endDate=${endDate}`)
    buildPlanningFromExecutions(executions, mondayStr)
  } catch (e) {
    loadedWeeks.delete(mondayStr) // allow retry on error
    console.error('Erreur chargement semaine:', e)
  }
}

onMounted(async () => {
  try {
    const typeSoins = await apiClient.get('/types-soins')
    const a2id = {}, id2a = {}
    typeSoins.forEach(ts => {
      Object.entries(ACTIVITY_TO_CODE).forEach(([activity, code]) => {
        if (ts.code === code) { a2id[activity] = ts.id; id2a[ts.id] = activity }
      })
    })
    activityToTypeSoinId.value = a2id
    typeSoinIdToActivity.value = id2a
  } catch (e) { console.error('Erreur types-soins:', e) }

  try {
    aidesSoignants.value = await apiClient.get('/aides-soignants')
  } catch (e) { console.error('Erreur aides-soignants:', e) }

  try {
    patients.value = await apiClient.get('/patients')
  } catch (e) { console.error('Erreur patients:', e) }

  await loadWeekExecutions(currentWeekMonday.value)
})

// Recharger les exécutions quand on change de semaine
watch(currentWeekMonday, (newMonday) => {
  loadWeekExecutions(newMonday)
})

const currentPlanning = computed(() => planningByWeek.value[weekKey.value])
const { aidesSoignantsAvecCharge, recommanderAS } = useCharge(currentPlanning, aidesSoignants)
const aidesCodes = computed(() => aidesSoignants.value.map((as) => as.code))

const weekLabel = computed(() => {
  const [y, m, d] = currentWeekMonday.value.split('-').map(Number)
  const start = new Date(y, m - 1, d)
  const end = new Date(y, m - 1, d + 6)
  // ISO week number
  const startOfYear = new Date(y, 0, 1)
  const weekNum = Math.ceil((((start - startOfYear) / 86400000) + startOfYear.getDay() + 1) / 7)
  return `Semaine ${weekNum} · Du ${start.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })} au ${end.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}`
})

const formatName = (patient) => {
  if (!patient) return ''
  const title = patient.prenom ? 'Mme ' : 'Mr/Mme '
  return `${title}${patient.nom}${patient.prenom ? ` ${patient.prenom}` : ''}`
}

const countEtage = (etage) => patients.value.filter((patient) => patient.etage === etage).length

const rowHasAS = (patientId, asCode) => {
  const planningPatient = currentPlanning.value?.[patientId]
  if (!planningPatient) return false
  return Object.values(planningPatient).some(dayActivities => {
    const activity = dayActivities[selectedActivity.value]
    // Chercher dans les assignments simples (as)
    if (activity?.as === asCode) return true
    // Chercher dans les assignments partagés (ases)
    if (activity?.ases?.includes(asCode)) return true
    return false
  })
}

const isPatientSansDouche = (patientId) => {
  const planningPatient = currentPlanning.value?.[patientId]
  if (!planningPatient) return true
  return Object.values(planningPatient).every((dayActivities) => !dayActivities || !dayActivities[selectedActivity.value])
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

const getCategoryColor = (categoryId) => {
  return PATIENT_CATEGORIES[categoryId]?.color || '#9CA3AF'
}

const getCellActivityData = (activityData) => {
  // Si aucun filtre AS n'est appliqué, retourner les données complètes
  if (filterAS.value === 'all') {
    return activityData
  }
  
  // Si un filtre AS est appliqué, vérifier si cet AS est dans l'activité
  if (!activityData) return null
  
  const hasFilteredAS = 
    (activityData.as === filterAS.value) || 
    (activityData.ases?.includes(filterAS.value))
  
  // Si l'AS filtré est dans l'activité, afficher les données
  // Sinon retourner null pour masquer la cellule
  return hasFilteredAS ? activityData : null
}

const patientsFiltres = computed(() => {
  const q = searchQuery.value.trim().toLowerCase()
  return patients.value.filter((patient) => {
    if (q) {
      const fullName = `${patient.nom} ${patient.prenom}`.toLowerCase()
      const chambre = (patient.numeroChambre || '').toLowerCase()
      if (!fullName.includes(q) && !chambre.includes(q)) return false
    }

    if (filterEtage.value !== 'all' && patient.etage !== Number(filterEtage.value)) {
      return false
    }

    if (filterSansDouche.value && !isPatientSansDouche(patient.id)) {
      return false
    }

    // Filtre par AS
    if (filterAS.value !== 'all' && !rowHasAS(patient.id, filterAS.value)) {
      return false
    }

    // Filtre par groupe coucher quand l'activité coucher est sélectionnée
    if (selectedActivity.value === 'coucher') {
      if ((patient.groupeCoucher || 'NON_DEFINI') !== coucherTab.value) {
        return false
      }
    }

    return true
  })
})

const previousWeek = () => {
  const [y, m, d] = currentWeekMonday.value.split('-').map(Number)
  currentWeekMonday.value = toISO(new Date(y, m - 1, d - 7))
}

const nextWeek = () => {
  const [y, m, d] = currentWeekMonday.value.split('-').map(Number)
  currentWeekMonday.value = toISO(new Date(y, m - 1, d + 7))
}

const goToCurrentWeek = () => {
  currentWeekMonday.value = getISOMonday()
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

// ─── Assignation / Suppression ─────────────────────────────────────────────

const getMomentAsHeure = (moment) => {
  const map = { 'matin': '08:00', 'soir': '18:00', '18-19': '18:00', '19-20': '19:00' }
  return map[moment] || '08:00'
}

const getAideSoignantId = (code) => aidesSoignants.value.find(a => a.code === code)?.id || null

const getDateStr = (jour) => {
  const dayIndex = joursSemaine.indexOf(jour)
  const [y, m, d] = currentWeekMonday.value.split('-').map(Number)
  return toISO(new Date(y, m - 1, d + dayIndex))
}

const postExec = async (payload) => {
  return apiClient.post('/executions', payload)
}

const deleteExecIds = async (ids) => {
  if (!ids) return
  const list = Array.isArray(ids) ? ids : [ids]
  await Promise.all(list.map(id => apiClient.delete(`/executions/${id}`).catch(() => {})))
}

const handleAssign = async (data) => {
  if (!modalPatient.value || !modalJour.value) return

  const typeSoinId = activityToTypeSoinId.value[selectedActivity.value]
  if (!typeSoinId) {
    console.error('TypeSoin manquant pour', selectedActivity.value, '— vérifiez le DataInitializer')
    closeModal()
    return
  }

  // Supprimer l'ancienne assignation en base
  const existing = planningByWeek.value[weekKey.value]?.[modalPatient.value.id]?.[modalJour.value]?.[selectedActivity.value]
  if (existing) {
    await deleteExecIds(existing._execId || existing._execIds)
  }

  // S'assurer que la structure locale existe
  ensureWeek(weekKey.value)
  if (!planningByWeek.value[weekKey.value][modalPatient.value.id]) planningByWeek.value[weekKey.value][modalPatient.value.id] = {}
  if (!planningByWeek.value[weekKey.value][modalPatient.value.id][modalJour.value]) planningByWeek.value[weekKey.value][modalPatient.value.id][modalJour.value] = {}

  const dateStr = getDateStr(modalJour.value)

  try {
    if (data.type === 'shared') {
      const moment = data.moment || 'matin'
      const [e1, e2] = await Promise.all([
        postExec({ patientId: modalPatient.value.id, typeSoinId, aideSoignantId: getAideSoignantId(data.ases[0]), secondAideSoignantId: getAideSoignantId(data.ases[1]), dateExecution: dateStr, heureExecution: getMomentAsHeure(moment), statut: 'PLANIFIE', commentaire: `Durée: ${data.durees[0]} min` }),
        postExec({ patientId: modalPatient.value.id, typeSoinId, aideSoignantId: getAideSoignantId(data.ases[1]), secondAideSoignantId: getAideSoignantId(data.ases[0]), dateExecution: dateStr, heureExecution: getMomentAsHeure(moment), statut: 'PLANIFIE', commentaire: `Durée: ${data.durees[1]} min` })
      ])
      planningByWeek.value[weekKey.value][modalPatient.value.id][modalJour.value][selectedActivity.value] = {
        type: 'shared', ases: data.ases, durees: data.durees.map(d => +d), moment, _execIds: [e1.id, e2.id]
      }
    } else {
      const { as: asCode, duree, moment } = data
      const exec = await postExec({ patientId: modalPatient.value.id, typeSoinId, aideSoignantId: getAideSoignantId(asCode), dateExecution: dateStr, heureExecution: getMomentAsHeure(moment || 'matin'), statut: 'PLANIFIE', commentaire: `Durée: ${duree || 30} min` })
      planningByWeek.value[weekKey.value][modalPatient.value.id][modalJour.value][selectedActivity.value] = {
        as: asCode, duree: +(duree || 30), moment: moment || 'matin', _execId: exec.id
      }
    }
  } catch (e) {
    console.error('Erreur sauvegarde:', e)
  }

  closeModal()
}

const handleRemove = async () => {
  if (!modalPatient.value || !modalJour.value) return
  const existing = planningByWeek.value[weekKey.value]?.[modalPatient.value.id]?.[modalJour.value]?.[selectedActivity.value]
  if (existing) {
    await deleteExecIds(existing._execId || existing._execIds)
    delete planningByWeek.value[weekKey.value][modalPatient.value.id][modalJour.value][selectedActivity.value]
  }
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

/* Barre de recherche */
.search-bar {
  display: flex;
  align-items: center;
  gap: 8px;
  background: white;
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-md);
  padding: 6px 12px;
  transition: border-color 0.15s;
}

.search-bar:focus-within {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
}

.search-icon {
  font-size: 14px;
  flex-shrink: 0;
}

.search-input {
  border: none;
  outline: none;
  font-size: 13px;
  color: var(--color-text-primary);
  background: transparent;
  width: 280px;
}

.search-input::placeholder {
  color: var(--color-text-tertiary);
}

.search-clear {
  background: none;
  border: none;
  cursor: pointer;
  color: var(--color-text-secondary);
  font-size: 12px;
  padding: 0 2px;
  line-height: 1;
}

.search-clear:hover {
  color: var(--color-text-primary);
}

.filters-bar {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
  padding: 10px 14px;
  background: white;
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-xs);
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
}

.filter-group-label {
  font-size: 10px;
  font-weight: 700;
  color: var(--color-text-tertiary);
  text-transform: uppercase;
  letter-spacing: 0.6px;
  padding-right: 4px;
  white-space: nowrap;
}

.filter-sep {
  width: 1px;
  height: 20px;
  background: var(--color-border-light);
  flex-shrink: 0;
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
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 13px;
  border: 1.5px solid;
  border-radius: 20px;
  background: white;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  white-space: nowrap;
}

.activity-pill:hover {
  transform: translateY(-1px);
  filter: brightness(0.92);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.activity-pill.is-active {
  font-weight: 700;
  transform: translateY(-1px);
}

.activity-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  flex-shrink: 0;
  transition: background 0.2s;
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
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.charge-mini::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(255,255,255,0.7) 0%, transparent 100%);
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
}

.charge-mini:hover {
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
  border-color: var(--color-primary);
}

.charge-mini:hover::before {
  opacity: 0.4;
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
  background: #F0FDF4;
}

.charge-mini.niveau-normal {
  background: #FEFCE8;
}

.charge-mini.niveau-eleve {
  background: #FFF7ED;
}

.charge-mini.niveau-surcharge {
  background: #FEF2F2;
}

/* ── Onglets coucher ─────────────────────────── */
.coucher-tabs {
  display: flex;
  gap: 10px;
}

.coucher-tab {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 18px;
  border: 2px solid var(--color-border-light);
  border-radius: var(--radius-lg);
  background: white;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 14px;
  font-weight: 600;
  color: var(--color-text-secondary);
  text-align: left;
  box-shadow: var(--shadow-xs);
}

.coucher-tab:hover {
  border-color: #F59E0B;
  background: #FFFBEB;
  color: var(--color-text-primary);
}

.coucher-tab.is-active {
  border-color: #F59E0B;
  background: linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 100%);
  color: #92400E;
  box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.15), var(--shadow-sm);
}

.coucher-tab-time {
  font-size: 11px;
  font-weight: 700;
  background: rgba(245, 158, 11, 0.15);
  color: #92400E;
  padding: 2px 7px;
  border-radius: 20px;
}

.coucher-tab-count {
  margin-left: auto;
  font-size: 11px;
  color: var(--color-text-tertiary);
  font-weight: 500;
}

.coucher-tab.is-active .coucher-tab-count {
  color: #B45309;
}

.planning-grid-card {
  background: white;
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-border-light);
  box-shadow: var(--shadow-sm);
  overflow: hidden;
  transition: all 0.3s ease;
}

.planning-grid-card:hover {
  box-shadow: var(--shadow-md);
}

.planning-grid {
  min-width: 960px;
  animation: fadeIn 0.4s ease-out;
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

.grid-cell-header.is-today {
  background: linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%);
  color: var(--color-primary);
}

.grid-cell-header.is-today .jour-label {
  color: var(--color-primary);
  font-weight: 800;
}

.grid-cell-header.is-today .jour-date {
  color: var(--color-primary-dark);
}

.today-dot {
  display: block;
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: var(--color-primary);
  margin: 0 auto;
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

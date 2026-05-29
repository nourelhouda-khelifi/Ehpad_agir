<template>
  <div class="planning-view">
    <div class="page-title-bar">
      <div>
        <h1 class="page-title">Planning des activités</h1>
        <p class="page-subtitle">{{ weekLabel }}</p>
      </div>
      <div class="page-actions">
        <CalendarWeekSelector
          v-model="currentWeek"
          :base-week-start="baseWeekStart"
        />
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
        <div class="charge-mini-meta">{{ as.nbActivites }} activité(s) · {{ as.nbPatients }} patient(s)</div>
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
            :as-code="currentPlanning?.[patient.id]?.[jour.key]?.[selectedActivity]?.as"
            :duree="currentPlanning?.[patient.id]?.[jour.key]?.[selectedActivity]?.duree"
            :moment="currentPlanning?.[patient.id]?.[jour.key]?.[selectedActivity]?.moment"
            :activity-data="currentPlanning?.[patient.id]?.[jour.key]?.[selectedActivity]"
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
      :semaine="currentWeek"
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
import { clonePlanning, createEmptyPlanningForPatients, mockPlanningSemaine19, mockPlanningSemaine20 } from '@/data/mockPlanning.js'
import { PATIENT_CATEGORIES } from '@/data/mockPatientProfils.js'
import { useCharge } from '@/composables/useCharge.js'

// LocalStorage keys
const PLANNING_STORAGE_KEY = 'ehpad_planning_data'

// Fonctions pour la persistance localStorage
const loadPlanningFromStorage = () => {
  try {
    const stored = localStorage.getItem(PLANNING_STORAGE_KEY)
    if (stored) {
      return JSON.parse(stored)
    }
  } catch (error) {
    console.error('Erreur chargement planning depuis localStorage:', error)
  }
  return null
}

const savePlanningToStorage = (planning) => {
  try {
    localStorage.setItem(PLANNING_STORAGE_KEY, JSON.stringify(planning))
  } catch (error) {
    console.error('Erreur sauvegarde planning dans localStorage:', error)
  }
}

const hasAnyActivity = (weekPlanning) => {
  return Object.values(weekPlanning || {}).some((patientDays) => {
    return Object.values(patientDays || {}).some((dayActivities) => {
      return Object.keys(dayActivities || {}).length > 0
    })
  })
}

const buildDefaultPlanningByWeek = () => ({
  19: clonePlanning(mockPlanningSemaine19),
  20: clonePlanning(mockPlanningSemaine20)
})

const mergeStoredPlanningWithDefaults = (storedPlanning) => {
  const merged = buildDefaultPlanningByWeek()

  if (storedPlanning && typeof storedPlanning === 'object') {
    Object.entries(storedPlanning).forEach(([week, planning]) => {
      if (hasAnyActivity(planning)) {
        merged[week] = planning
      }
    })
  }

  return merged
}

const patients = ref([])
const aidesSoignants = ref([])
const debugInfo = ref('initial state')
const planningByWeek = ref(buildDefaultPlanningByWeek())

const currentWeek = ref(20)
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
  repas: { icon: '🍽️', label: 'Repas', color: '#10B981' },
  lever: { icon: '⬆️', label: 'Lever', color: '#EC4899' },
  sieste: { icon: '😴', label: 'Sieste', color: '#8B5CF6' },
  petitDejeuner: { icon: '🥐', label: 'Petit déjeuner', color: '#F59E0B' }
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
const { aidesSoignantsAvecCharge, recommanderAS } = useCharge(currentPlanning, aidesSoignants)
const aidesCodes = computed(() => aidesSoignants.value.map((as) => as.code))

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
  const planningPatient = currentPlanning.value?.[patientId]
  if (!planningPatient) return false
  return Object.values(planningPatient).some(dayActivities => {
    return dayActivities[selectedActivity.value]?.as === asCode
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

// Charger les données du localStorage et de l'API au montage
onMounted(() => {
  // Charger d'abord le localStorage IMMÉDIATEMENT
  const storedData = loadPlanningFromStorage()
  if (storedData) {
    planningByWeek.value = mergeStoredPlanningWithDefaults(storedData)
  }
  
  // Puis charger l'API dans une promesse séparée
  setTimeout(() => {
    // Fetch aides-soignants
    fetch('http://localhost:8081/api/aides-soignants')
      .then(r => r.json())
      .then(data => {
        aidesSoignants.value = data
        
        // Nettoyer la planning pour ne garder que les aides qui existent
        if (data.length > 0) {
          const validAideCodes = new Set(data.map(as => as.code))
          Object.entries(planningByWeek.value).forEach(([week, weekPlanning]) => {
            Object.entries(weekPlanning).forEach(([patientId, dayPlannings]) => {
              Object.entries(dayPlannings).forEach(([day, activities]) => {
                Object.entries(activities).forEach(([activity, actData]) => {
                  if (actData?.type === 'shared') {
                    actData.ases = actData.ases?.filter(code => validAideCodes.has(code))
                    actData.durees = actData.durees?.slice(0, actData.ases.length)
                    if (actData.ases.length === 0) {
                      delete activities[activity]
                    }
                  } else if (actData?.as && !validAideCodes.has(actData.as)) {
                    delete activities[activity]
                  }
                })
              })
            })
          })
        }
      })
      .catch(e => {
        console.error('Erreur fetch aides-soignants:', e)
      })

    // Fetch patients
    fetch('http://localhost:8081/api/patients')
      .then(r => r.json())
      .then(data => {
        patients.value = data
        
        // Ensure planning exists for all patients
        Object.keys(planningByWeek.value).forEach(week => {
          const weekPlanning = planningByWeek.value[week]
          data.forEach(patient => {
            if (!weekPlanning[patient.id]) {
              weekPlanning[patient.id] = joursSemaine.reduce((acc, jour) => {
                acc[jour] = {}
                return acc
              }, {})
            }
          })
        })
      })
      .catch(e => {
        console.error('Erreur fetch patients:', e)
      })

    // Charger les ExecutionSoins depuis l'API
    fetch('http://localhost:8081/api/executions')
      .then(r => r.json())
      .then(data => {
        // Grouper les executions par patient/date/activity/typeSoin pour détecter les 2-aides
        const grouped = {}
        
        data.forEach(execution => {
          const execDate = new Date(execution.dateExecution + 'T00:00:00')
          
          // Calculer la semaine
          const dayDiff = Math.floor((execDate - baseWeekStart) / (24 * 60 * 60 * 1000))
          const week = 19 + Math.floor(dayDiff / 7)
          const dayOfWeek = dayDiff % 7
          
          // Mapper typeSoinId vers activity key
          const activityMap = {
            1: 'toilette',
            2: 'douche',
            3: 'pansement',
            4: 'injection',
            5: 'repas'
          }
          const activity = activityMap[execution.typeSoinId] || 'toilette'
          
          // Mapper heure vers moment
          const hour = parseInt(execution.heureExecution.split(':')[0])
          let moment = 'matin'
          if (hour >= 18) moment = hour === 18 ? '18-19' : hour === 19 ? '19-20' : 'soir'
          else if (hour >= 14) moment = 'soir'
          
          // Clé de groupement: patient/week/day/activity/moment
          const groupKey = `${execution.patientId}_${week}_${dayOfWeek}_${activity}_${moment}`
          
          if (!grouped[groupKey]) {
            grouped[groupKey] = {
              week,
              patientId: execution.patientId,
              day: joursSemaine[dayOfWeek],
              activity,
              moment,
              aides: [],
              duree: execution.commentaire?.match(/Durée: (\d+)/)?.[1] || 30,
              commentaire: execution.commentaire
            }
          }
          
          if (execution.aideSoignant?.code) {
            grouped[groupKey].aides.push(execution.aideSoignant.code)
          }
        })
        
        // Ajouter à la structure planningByWeek
        Object.values(grouped).forEach(group => {
          if (!planningByWeek.value[group.week]) {
            planningByWeek.value[group.week] = {}
          }
          if (!planningByWeek.value[group.week][group.patientId]) {
            planningByWeek.value[group.week][group.patientId] = {}
          }
          if (!planningByWeek.value[group.week][group.patientId][group.day]) {
            planningByWeek.value[group.week][group.patientId][group.day] = {}
          }
          
          // Créer l'objet activité (1 aide ou 2 aides)
          if (group.aides.length === 2) {
            // Assignation 2 aides
            planningByWeek.value[group.week][group.patientId][group.day][group.activity] = {
              type: 'shared',
              ases: group.aides,
              durees: [group.duree, group.duree],
              moment: group.moment
            }
          } else if (group.aides.length === 1) {
            // Assignation 1 aide
            planningByWeek.value[group.week][group.patientId][group.day][group.activity] = {
              as: group.aides[0],
              duree: group.duree,
              moment: group.moment
            }
          }
        })
      })
      .catch(e => {
        console.error('Erreur fetch executions:', e)
      })
  }, 100)
})

// Sauvegarder les données PROFONDÉMENT dans localStorage
watch(
  () => planningByWeek.value,
  (newValue) => {
    savePlanningToStorage(newValue)
  },
  { deep: true, immediate: false }
)

const ensurePatientPlanning = (patientId) => {
  if (!currentPlanning.value[patientId]) {
    currentPlanning.value[patientId] = joursSemaine.reduce((acc, jour) => {
      acc[jour] = {}
      return acc
    }, {})
  }
}

const handleAssign = (data) => {
  if (!modalPatient.value || !modalJour.value) return
  
  // S'assurer que la semaine existe dans planningByWeek
  if (!planningByWeek.value[currentWeek.value]) {
    planningByWeek.value[currentWeek.value] = {}
  }
  
  ensurePatientPlanning(modalPatient.value.id)
  
  // Mettre à jour le planning local
  if (data.type === 'shared') {
    // Tâche à 2 aides
    currentPlanning.value[modalPatient.value.id][modalJour.value][selectedActivity.value] = {
      type: 'shared',
      ases: data.ases,
      durees: data.durees,
      moment: data.moment || 'matin'
    }
  } else {
    // Tâche simple (1 aide)
    const { as: codeAS, duree, moment } = typeof data === 'string' ? { as: data, duree: 30, moment: 'matin' } : data
    currentPlanning.value[modalPatient.value.id][modalJour.value][selectedActivity.value] = {
      as: codeAS,
      duree,
      moment: moment || 'matin'
    }
  }
  
  // Appeler l'API pour persister dans le backend
  saveActivityToBackend(data)
  closeModal()
}

const saveActivityToBackend = (data) => {
  // Mapper l'activité sélectionnée en typeSoinId
  const activityMap = {
    douche: 2,
    toilette: 1,
    wc: 1,
    coucher: 1,
    repas: 5,
    lever: 1,
    sieste: 1,
    petitDejeuner: 1
  }
  
  const typeSoinId = activityMap[selectedActivity.value] || 1
  
  // Trouver l'ID de l'aide-soignant à partir du code
  const getAideSoignantId = (code) => {
    const as = aidesSoignants.value.find(a => a.code === code)
    return as ? as.id : null
  }
  
  // Convertir moment en heure
  const getMomentAsHeure = (moment) => {
    const momentMap = {
      'matin': '08:00',
      'soir': '18:00',
      '18-19': '18:00',
      '19-20': '19:00'
    }
    return momentMap[moment] || '08:00'
  }
  
  // Créer le payload pour l'API
  const aideSoignantId = data.type === 'shared' ? getAideSoignantId(data.ases[0]) : getAideSoignantId(data.as)
  const secondAideSoignantId = data.type === 'shared' ? getAideSoignantId(data.ases[1]) : null
  
  // Construire la date complète: calculer à partir de baseWeekStart et du jour sélectionné
  // baseWeekStart = May 11, 2026 (week 19, lundi)
  // currentWeek = 20 = week 20 starts May 18
  // currentWeek = 21 = week 21 starts May 25
  const dayIndex = joursSemaine.indexOf(modalJour.value)
  const weekOffset = currentWeek.value - 19 // week 19 = 0, week 20 = 1, week 21 = 2, etc.
  const dateObj = new Date(baseWeekStart)
  dateObj.setDate(baseWeekStart.getDate() + (weekOffset * 7) + dayIndex)
  
  const payload = {
    patientId: modalPatient.value.id,
    typeSoinId: typeSoinId,
    aideSoignantId: aideSoignantId,
    ...(secondAideSoignantId && { secondAideSoignantId: secondAideSoignantId }),
    dateExecution: dateObj.toLocaleDateString('en-CA'),
    heureExecution: getMomentAsHeure(data.moment || 'matin'),
    statut: 'PLANIFIE',
    commentaire: `Durée: ${data.duree || 'auto'} min${data.type === 'shared' ? ` - 2 aides: ${data.ases.join(', ')}` : ''}`
  }
  
  // Appeler l'API
  fetch('http://localhost:8081/api/executions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  })
  .then(r => {
    if (!r.ok) throw new Error(`HTTP ${r.status}`)
    return r.json()
  })
  .then(result => {
    console.log('Activity saved to backend:', result)
  })
  .catch(e => {
    console.error('Erreur save activity:', e)
  })
}

const handleRemove = () => {
  if (!modalPatient.value || !modalJour.value) return
  ensurePatientPlanning(modalPatient.value.id)
  delete currentPlanning.value[modalPatient.value.id][modalJour.value][selectedActivity.value]
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
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  white-space: nowrap;
  position: relative;
  overflow: hidden;
}

.activity-pill:hover {
  border-color: var(--color-primary);
  background: rgba(37, 99, 235, 0.08);
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(37, 99, 235, 0.15);
}

.activity-pill.is-active {
  background: linear-gradient(135deg, var(--color-primary) 0%, #1D4ED8 100%);
  color: white;
  border-color: var(--color-primary);
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.25);
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

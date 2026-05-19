<template>
  <div class="planning-weekly">
    <!-- Header -->
    <div class="page-title-bar">
      <div>
        <h1 class="page-title">Planning de la semaine</h1>
        <p class="page-subtitle">{{ weekLabel }}</p>
      </div>
      <div class="page-actions">
        <CalendarWeekSelector
          v-model="currentWeek"
          :base-week-start="baseWeekStart"
        />
      </div>
    </div>

    <!-- Stats résumé -->
    <div class="stats-row">
      <div class="stat-item">
        <span class="stat-icon">📋</span>
        <div>
          <div class="stat-value">{{ totalActivites }}</div>
          <div class="stat-label">Activités planifiées</div>
        </div>
      </div>
      <div class="stat-item">
        <span class="stat-icon">👥</span>
        <div>
          <div class="stat-value">{{ patientsFiltres.length }}</div>
          <div class="stat-label">Patients affichés</div>
        </div>
      </div>
      <div class="stat-item">
        <span class="stat-icon">👨‍⚕️</span>
        <div>
          <div class="stat-value">{{ aidesSoignants.length }}</div>
          <div class="stat-label">Aides-soignants</div>
        </div>
      </div>
    </div>

    <!-- Filtres AS -->
    <div class="filters-bar">
      <span class="filter-title">Planning par aide-soignante :</span>
      <div class="filter-buttons">
        <button
          class="filter-btn all"
          :class="{ 'is-active': filterAS === 'all' }"
          @click="filterAS = 'all'"
        >
          Tous
        </button>
        <button
          class="filter-btn se1"
          :class="{ 'is-active': filterAS === 'SE1' }"
          @click="filterAS = 'SE1'"
        >
          SE1
        </button>
        <button
          class="filter-btn se2"
          :class="{ 'is-active': filterAS === 'SE2' }"
          @click="filterAS = 'SE2'"
        >
          SE2
        </button>
        <button
          class="filter-btn sc1"
          :class="{ 'is-active': filterAS === 'SC1' }"
          @click="filterAS = 'SC1'"
        >
          SC1
        </button>
        <button
          class="filter-btn sc2"
          :class="{ 'is-active': filterAS === 'SC2' }"
          @click="filterAS = 'SC2'"
        >
          SC2
        </button>
        <button
          class="filter-btn sg"
          :class="{ 'is-active': filterAS === 'SG' }"
          @click="filterAS = 'SG'"
        >
          SG
        </button>
      </div>
      <button v-if="filterAS !== 'all'" class="btn-pdf" @click="downloadPDF">
        📥 Télécharger PDF
      </button>
    </div>

    <!-- Planning Hebdomadaire -->
    <div class="weekly-planning" ref="planningRef">
      <div class="planning-grid">
        <!-- En-têtes jours -->
        <div class="grid-header-patient">Patient / Chambre</div>
        <div v-for="jour in joursSemaine" :key="jour" class="grid-header-day">
          <div class="day-name">{{ jour }}</div>
          <div class="day-date">{{ getDateForDay(jour) }}</div>
        </div>

        <!-- Lignes patients -->
        <template v-for="patient in patientsFiltres" :key="patient.id">
          <div class="grid-patient-info">
            <div class="patient-name">{{ patient.prenom }} {{ patient.nom }}</div>
            <div class="patient-room">{{ patient.chambre }}</div>
          </div>
          <div v-for="jour in joursSemaine" :key="`${patient.id}-${jour}`" class="grid-cell">
            <template v-if="getFilteredActivities(patient.id, jour) && Object.keys(getFilteredActivities(patient.id, jour)).length > 0">
              <div 
                v-for="(activityData, activityKey) in getFilteredActivities(patient.id, jour)" 
                :key="`${patient.id}-${jour}-${activityKey}`"
                class="activity-badge" 
                :class="getActivityClass(activityKey)"
                @click="handleActivityClick(patient, jour, activityKey)"
              >
                <span class="activity-type">{{ getActivityLabel(activityKey) }}</span>
                <!-- Affichage simple -->
                <span v-if="!activityData.type || activityData.type !== 'shared'" class="activity-as">
                  {{ activityData.as }}
                  <span v-if="activityData.duree" class="activity-duree">{{ activityData.duree }}m</span>
                </span>
                <!-- Affichage partagé -->
                <template v-else>
                  <span v-for="(as, idx) in activityData.ases" :key="idx" class="activity-as-shared">
                    {{ as }}
                    <span v-if="activityData.durees && activityData.durees[idx]" class="activity-duree">{{ activityData.durees[idx] }}m</span>
                  </span>
                </template>
              </div>
            </template>
            <div v-else class="activity-empty">—</div>
          </div>
        </template>
      </div>
    </div>

    <!-- Légende -->
    <div class="legend">
      <span class="legend-title">Types d'activités :</span>
      <div v-for="(config, key) in activitiesConfig" :key="key" class="legend-item">
        <span class="legend-dot" :style="{ background: config.color }"></span>
        <span>{{ config.label }}</span>
      </div>
    </div>

    <!-- Modal Commentaire WC -->
    <div v-if="showCommentModal" class="modal-overlay" @click.self="showCommentModal = false">
      <div class="modal-content">
        <div class="modal-header">
          <h2>{{ selectedPatient?.prenom }} {{ selectedPatient?.nom }} - {{ selectedJour }} {{ datesOfWeek[selectedJour] }}</h2>
          <button class="close-btn" @click="showCommentModal = false">✕</button>
        </div>
        <div class="modal-body">
          <div class="activity-info">
            <span class="activity-label">Activité :</span>
            <span class="activity-value">{{ getActivityLabel(selectedActivity) }}</span>
          </div>
          <div class="comment-section">
            <label for="comment">Commentaire :</label>
            <textarea 
              id="comment" 
              v-model="currentComment" 
              placeholder="Ajouter ou modifier le commentaire..."
              rows="4"
            ></textarea>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn-cancel" @click="showCommentModal = false">Fermer</button>
          <button class="btn-save" @click="saveComment">Enregistrer</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import CalendarWeekSelector from '@/components/ui/CalendarWeekSelector.vue'
import { mockPatients } from '@/data/mockPatients.js'
import { mockAidesSoignants } from '@/data/mockAides.js'
import { mockPlanningSemaine19, mockPlanningSemaine20, joursSemaine, clonePlanning, createEmptyPlanningForPatients } from '@/data/mockPlanning.js'
import { jsPDF } from 'jspdf'
import html2canvas from 'html2canvas'

// LocalStorage key
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

const patients = ref(mockPatients)
const aidesSoignants = ref(mockAidesSoignants)

// Gestion des semaines
const baseWeekStart = new Date(2026, 4, 11)
const planningByWeek = ref({
  19: clonePlanning(mockPlanningSemaine19),
  20: clonePlanning(mockPlanningSemaine20)
})
const currentWeek = ref(20)

const ensurePlanningForWeek = (week) => {
  if (!planningByWeek.value[week]) {
    planningByWeek.value[week] = createEmptyPlanningForPatients(patients.value)
  }
}

watch(currentWeek, (week) => {
  ensurePlanningForWeek(week)
}, { immediate: true })

const currentPlanning = computed(() => planningByWeek.value[currentWeek.value])

const weekLabel = computed(() => {
  const start = new Date(baseWeekStart)
  start.setDate(baseWeekStart.getDate() + (currentWeek.value - 19) * 7)
  const end = new Date(start)
  end.setDate(start.getDate() + 6)
  return `Semaine ${currentWeek.value} du ${start.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })} au ${end.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}`
})

const datesOfWeek = computed(() => {
  const dates = {}
  joursSemaine.forEach((jour, index) => {
    const date = new Date(baseWeekStart)
    date.setDate(baseWeekStart.getDate() + index + (currentWeek.value - 19) * 7)
    dates[jour] = date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })
  })
  return dates
})

const filterAS = ref('all')

// Charger et synchroniser les données du localStorage
onMounted(() => {
  const storedData = loadPlanningFromStorage()
  if (storedData) {
    Object.assign(planningByWeek.value, storedData)
  }
})

// Mettre à jour le localStorage quand les données changent
watch(
  () => planningByWeek.value,
  (newValue) => {
    savePlanningToStorage(newValue)
  },
  { deep: true, immediate: false }
)

// Référence pour capturer le planning
const planningRef = ref(null)

// Modal commentaires
const showCommentModal = ref(false)
const selectedPatient = ref(null)
const selectedJour = ref(null)
const selectedActivity = ref(null)
const currentComment = ref('')

// Configuration des activités
const activitiesConfig = {
  douche: { label: 'Douche', color: '#3B82F6' },
  wc: { label: 'WC', color: '#A855F7' },
  toilette: { label: 'Toilette', color: '#06B6D4' },
  coucher: { label: 'Coucher', color: '#F97316' },
  repas: { label: 'Repas', color: '#22C55E' },
  lever: { label: 'Lever', color: '#EC4899' },
  sieste: { label: 'Sieste', color: '#8B5CF6' },
  petitDejeuner: { label: 'Petit déjeuner', color: '#F59E0B' }
}

// Patients filtrés par AS
const patientsFiltres = computed(() => {
  if (filterAS.value === 'all') return patients.value
  
  const filteredIds = new Set()
  Object.entries(currentPlanning.value).forEach(([patientId, days]) => {
    Object.values(days).forEach(dayActivities => {
      // dayActivities is now { activity: { as, duree, moment } } or { activity: { type: 'shared', ases, durees, moment } }
      Object.values(dayActivities || {}).forEach(activity => {
        // Check simple assignment
        if (activity?.as === filterAS.value) {
          filteredIds.add(Number(patientId))
        }
        // Check shared assignment
        if (activity?.ases && activity.ases.includes(filterAS.value)) {
          filteredIds.add(Number(patientId))
        }
      })
    })
  })
  
  return patients.value.filter(p => filteredIds.has(p.id))
})

// Stats
const totalActivites = computed(() => {
  let count = 0
  Object.values(currentPlanning.value).forEach(patientDays => {
    Object.values(patientDays).forEach(dayActivities => {
      // dayActivities is now { activity: { as, duree, moment } }
      Object.values(dayActivities || {}).forEach(activity => {
        if (activity) count++
      })
    })
  })
  return count
})

// Fonctions
const getActivityForPatient = (patientId, jour) => {
  // Return the activities object for a given day (could have multiple activities)
  return currentPlanning.value[patientId]?.[jour]
}

const getFilteredActivities = (patientId, jour) => {
  // Return only activities that concern the filtered AS
  const activities = getActivityForPatient(patientId, jour)
  if (!activities || filterAS.value === 'all') return activities
  
  // Filter activities to show only those for the selected AS
  const filtered = {}
  Object.entries(activities).forEach(([actKey, actData]) => {
    // Check if this activity concerns the filtered AS
    if (actData?.as === filterAS.value) {
      filtered[actKey] = actData
    } else if (actData?.ases && actData.ases.includes(filterAS.value)) {
      filtered[actKey] = actData
    }
  })
  
  return Object.keys(filtered).length > 0 ? filtered : null
}

const getActivityLabel = (activity) => {
  return activitiesConfig[activity]?.label || '?'
}

const getActivityClass = (activity) => {
  return `activity-${activity}`
}

const getDateForDay = (jour) => {
  return datesOfWeek[jour]
}

// Get first activity (for display - if multiple, show first)
const getFirstActivityKey = (dayActivities) => {
  if (!dayActivities) return null
  return Object.keys(dayActivities)[0]
}

// Gestion modal commentaires
const handleActivityClick = (patient, jour, activity) => {
  if (activity === 'wc') {
    selectedPatient.value = patient
    selectedJour.value = jour
    selectedActivity.value = activity
    currentComment.value = patient.wcsCommentaires?.[jour] || ''
    showCommentModal.value = true
  }
}

const saveComment = () => {
  if (selectedPatient.value && selectedJour.value) {
    if (!selectedPatient.value.wcsCommentaires) {
      selectedPatient.value.wcsCommentaires = {}
    }
    selectedPatient.value.wcsCommentaires[selectedJour.value] = currentComment.value || null
    showCommentModal.value = false
  }
}

// Fonction pour générer et télécharger le PDF
const downloadPDF = async () => {
  try {
    // ===== PAGE 1: PLANNING CAPTURE (A4 landscape) =====
    const doc = new jsPDF('l', 'mm', 'a4') // A4 landscape
    const pageHeight = doc.internal.pageSize.getHeight()
    const pageWidth = doc.internal.pageSize.getWidth()

    if (planningRef.value) {
      try {
        // Ajouter le titre
        doc.setFontSize(18)
        doc.setFont(undefined, 'bold')
        doc.text('Planning de la semaine', pageWidth / 2, 8, { align: 'center' })
        
        doc.setFontSize(10)
        doc.setFont(undefined, 'normal')
        doc.text(`Aide-soignante: ${filterAS.value} - Semaine du 11 au 17 mai 2026`, pageWidth / 2, 14, { align: 'center' })
        
        // Capture ultra haute résolution pour net maximal
        const canvas = await html2canvas(planningRef.value, {
          scale: 2.5, // Ultra net
          backgroundColor: '#ffffff',
          logging: false,
          useCORS: true,
          allowTaint: true
        })
        
        // Agrandir à 78% - très grand et net
        const imgData = canvas.toDataURL('image/png')
        const maxWidth = pageWidth - 4
        const scaleDown = 0.78
        const imgWidth = maxWidth * scaleDown
        const imgHeight = (canvas.height * imgWidth) / canvas.width
        
        // Centrer horizontalement, position après titre
        const xPos = (pageWidth - imgWidth) / 2
        const yPos = 20
        
        // Réduire verticalement si trop grand
        if (imgHeight > pageHeight - yPos - 2) {
          const newImgHeight = pageHeight - yPos - 2
          const newImgWidth = (canvas.width * newImgHeight) / canvas.height
          doc.addImage(imgData, 'PNG', (pageWidth - newImgWidth) / 2, yPos, newImgWidth, newImgHeight)
        } else {
          doc.addImage(imgData, 'PNG', xPos, yPos, imgWidth, imgHeight)
        }
      } catch (error) {
        console.error('Erreur capture:', error)
      }
    }

    // ===== PAGE 2: TOILETTES (mode portrait A4) =====
    doc.addPage('p', 'a4')
    const pageHeightToilettes = doc.internal.pageSize.getHeight()
    
    doc.setFontSize(16)
    doc.text(`Tableau des Toilettes - ${filterAS.value}`, 15, 15)

    doc.setFontSize(10)
    doc.text('Semaine du 11 au 17 mai 2026', 15, 25)

    // Collecter les données de toilettes - TOUS les patients
    const toiletteRows = []
    patients.value.forEach(patient => {
      const toiletteDays = []
      const comments = []

      joursSemaine.forEach(jour => {
        if (patient.toilettes?.[jour] === filterAS.value) {
          toiletteDays.push(jour.charAt(0).toUpperCase() + jour.slice(1))
          const comment = patient.toilettesCommentaires?.[jour]
          if (comment) {
            comments.push(comment)
          }
        }
      })

      // Ajouter SEULEMENT si le patient a au moins une toilette ce soignant
      if (toiletteDays.length > 0) {
        toiletteRows.push({
          patient: `${patient.prenom} ${patient.nom}`,
          chambre: patient.chambre,
          jours: toiletteDays.length > 0 ? toiletteDays.join(', ') : '-',
          commentaires: comments.length > 0 ? comments.join('\n') : '-'
        })
      }
    })

    // Tableau des toilettes amélioré
    const toilColWidths = [30, 18, 32, 45, 50]
    const toilHeaders = ['Patient', 'Chambre', 'Jours', 'Commentaires dossier', 'Notes soignant']
    
    const startY = 35
    let toilY = startY
    const margin = 12
    const headerHeight = 10
    
    // En-tête du tableau
    doc.setDrawColor(59, 130, 246)
    doc.setLineWidth(0.5)
    doc.setFillColor(59, 130, 246)
    doc.setTextColor(255, 255, 255)
    doc.setFont(undefined, 'bold')
    doc.setFontSize(10)

    let colX = margin
    toilHeaders.forEach((header, idx) => {
      doc.rect(colX, toilY, toilColWidths[idx], headerHeight, 'FD')
      doc.text(header, colX + 2, toilY + 6.5, { maxWidth: toilColWidths[idx] - 4, align: 'left' })
      colX += toilColWidths[idx]
    })

    toilY += headerHeight
    
    if (toiletteRows.length === 0) {
      doc.setTextColor(0, 0, 0)
      doc.setFont(undefined, 'normal')
      doc.setFontSize(10)
      doc.text('Aucune toilette planifiée pour cette aide-soignante', margin, toilY + 10)
    } else {
      doc.setTextColor(0, 0, 0)
      doc.setFont(undefined, 'normal')
      doc.setFontSize(9)

      toiletteRows.forEach((row, idx) => {
        // Vérifier si nouvelle page nécessaire
        if (toilY > pageHeightToilettes - 20) {
          doc.addPage('p', 'a4')
          toilY = 15
        }

        // Calculer la hauteur de la ligne selon le contenu
        const splitComments = doc.splitTextToSize(row.commentaires, toilColWidths[3] - 4)
        const maxLines = Math.max(
          1,
          splitComments.length
        )
        const rowHeight = Math.max(10, maxLines * 4.5 + 4)

        // Couleur alternée
        const bgColor = idx % 2 === 0 ? [245, 248, 252] : [255, 255, 255]
        doc.setFillColor(...bgColor)
        
        colX = margin
        // Remplir les cellules
        for (let i = 0; i < toilColWidths.length; i++) {
          doc.rect(colX, toilY, toilColWidths[i], rowHeight, 'F')
          colX += toilColWidths[i]
        }

        // Bordures
        doc.setDrawColor(59, 130, 246)
        doc.setLineWidth(0.3)
        colX = margin
        for (let i = 0; i < toilColWidths.length; i++) {
          doc.rect(colX, toilY, toilColWidths[i], rowHeight)
          colX += toilColWidths[i]
        }

        // Contenu des cellules
        doc.setTextColor(0, 0, 0)
        colX = margin

        // Patient (gras)
        doc.setFont(undefined, 'bold')
        doc.text(row.patient, colX + 2, toilY + 3.5, { maxWidth: toilColWidths[0] - 4 })
        colX += toilColWidths[0]

        // Chambre
        doc.setFont(undefined, 'normal')
        doc.text(row.chambre, colX + 2, toilY + 3.5, { maxWidth: toilColWidths[1] - 4 })
        colX += toilColWidths[1]

        // Jours
        doc.text(row.jours, colX + 2, toilY + 3.5, { maxWidth: toilColWidths[2] - 4 })
        colX += toilColWidths[2]

        // Commentaires dossier (gris italique, wrapped)
        doc.setTextColor(80, 80, 80)
        doc.setFont(undefined, 'italic')
        doc.setFontSize(8)
        const commentLines = doc.splitTextToSize(row.commentaires, toilColWidths[3] - 4)
        doc.text(commentLines, colX + 2, toilY + 3, { maxWidth: toilColWidths[3] - 4, align: 'left' })
        colX += toilColWidths[3]

        // Notes soignant (vide - espace blanc pour écrire)
        doc.setDrawColor(180, 180, 180)
        doc.setLineWidth(0.2)
        doc.setFontSize(9)
        doc.setTextColor(200, 200, 200)
        doc.setFont(undefined, 'normal')

        doc.setFontSize(9)
        toilY += rowHeight
      })
    }

    // Télécharger
    doc.save(`Planning_${filterAS.value}_semaine19.pdf`)
  } catch (error) {
    console.error('Erreur lors de la génération du PDF:', error)
    alert('Erreur lors de la génération du PDF: ' + error.message)
  }
}
</script>

<style scoped>
.planning-weekly {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px 24px;
}

/* Header */
.page-title-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
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

/* Stats */
.stats-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 12px;
}

.stat-item {
  background: white;
  border: 1px solid #E2E8F0;
  border-radius: 8px;
  padding: 16px;
  display: flex;
  gap: 12px;
  align-items: center;
}

.stat-icon {
  font-size: 24px;
}

.stat-value {
  font-size: 20px;
  font-weight: 700;
  color: #1E293B;
}

.stat-label {
  font-size: 12px;
  color: #64748B;
}

/* Filtres */
.filters-bar {
  background: white;
  border: 1px solid #E2E8F0;
  border-radius: 8px;
  padding: 16px;
  display: flex;
  gap: 12px;
  align-items: center;
  flex-wrap: wrap;
}

.filter-title {
  font-weight: 600;
  color: #1E293B;
  font-size: 13px;
}

.filter-buttons {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.filter-btn {
  padding: 8px 14px;
  border: 1px solid #E2E8F0;
  border-radius: 6px;
  background: white;
  color: #64748B;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.filter-btn:hover {
  border-color: #CBD5E1;
  background: #F8FAFC;
}

.btn-pdf {
  padding: 8px 14px;
  border: 1px solid #3B82F6;
  border-radius: 6px;
  background: #3B82F6;
  color: white;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-left: auto;
}

.btn-pdf:hover {
  background: #2563EB;
  border-color: #2563EB;
}

.filter-btn.is-active {
  background: #2563EB;
  color: white;
  border-color: #2563EB;
}

.filter-btn.se1.is-active {
  background: #059669;
  border-color: #059669;
}

.filter-btn.se2.is-active {
  background: #0891b2;
  border-color: #0891b2;
}

.filter-btn.sc1.is-active {
  background: #7C3AED;
  border-color: #7C3AED;
}

.filter-btn.sc2.is-active {
  background: #DB2777;
  border-color: #DB2777;
}

.filter-btn.sg.is-active {
  background: #EA580C;
  border-color: #EA580C;
}

/* Planning Grid */
.weekly-planning {
  background: white;
  border: 1px solid #E2E8F0;
  border-radius: 8px;
  overflow-x: auto;
}

.planning-grid {
  display: grid;
  grid-template-columns: 150px repeat(7, 1fr);
  gap: 1px;
  background: #E2E8F0;
  padding: 1px;
  min-width: 1200px;
}

.grid-header-patient {
  background: linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%);
  color: white;
  padding: 12px;
  font-weight: 600;
  font-size: 13px;
  position: sticky;
  left: 0;
  z-index: 10;
}

.grid-header-day {
  background: linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%);
  color: white;
  padding: 12px 8px;
  font-weight: 600;
  font-size: 12px;
  text-align: center;
}

.day-name {
  text-transform: capitalize;
  margin-bottom: 4px;
}

.day-date {
  font-size: 11px;
  opacity: 0.9;
}

.grid-patient-info {
  background: #F8FAFC;
  padding: 12px;
  font-size: 13px;
  position: sticky;
  left: 0;
  z-index: 10;
  border-right: 1px solid #E2E8F0;
}

.patient-name {
  font-weight: 600;
  color: #1E293B;
  margin-bottom: 2px;
}

.patient-room {
  font-size: 11px;
  color: #64748B;
}

.grid-cell {
  background: white;
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 70px;
}

.activity-badge {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 10px 12px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  text-align: center;
  width: 100%;
  border: 2px solid;
}

.activity-type {
  font-size: 13px;
  font-weight: 700;
}

.activity-as {
  font-size: 11px;
  font-weight: 500;
  opacity: 0.8;
}

.activity-as-shared {
  font-size: 10px;
  font-weight: 600;
  opacity: 0.85;
  display: block;
  margin-top: 2px;
}

.activity-duree {
  font-size: 9px;
  font-weight: 500;
  opacity: 0.7;
  margin-top: 2px;
  display: block;
}

.activity-douche {
  background: #3B82F6 15%;
  color: #1E40AF;
  border-color: #3B82F6;
}

.activity-wc {
  background: #A855F7 15%;
  color: #6B21A8;
  border-color: #A855F7;
}

.activity-toilette {
  background: #06B6D4 15%;
  color: #0E7490;
  border-color: #06B6D4;
}

.activity-coucher {
  background: #F97316 15%;
  color: #92400E;
  border-color: #F97316;
}

.activity-repas {
  background: #22C55E 15%;
  color: #15803D;
  border-color: #22C55E;
}

.activity-empty {
  color: #CBD5E1;
  font-weight: 500;
  font-size: 18px;
}

/* Legend */
.legend {
  background: white;
  border: 1px solid #E2E8F0;
  border-radius: 8px;
  padding: 12px 16px;
  display: flex;
  gap: 24px;
  flex-wrap: wrap;
  align-items: center;
}

.legend-title {
  font-weight: 600;
  color: #1E293B;
  font-size: 13px;
}

.legend-item {
  display: flex;
  gap: 6px;
  align-items: center;
  font-size: 12px;
  color: #64748B;
}

.legend-dot {
  width: 12px;
  height: 12px;
  border-radius: 2px;
  flex-shrink: 0;
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 8px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  max-width: 500px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #E2E8F0;
}

.modal-header h2 {
  font-size: 16px;
  font-weight: 700;
  color: #1E293B;
  margin: 0;
}

.close-btn {
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: #64748B;
  padding: 0;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: all 0.2s ease;
}

.close-btn:hover {
  background: #F1F5F9;
  color: #1E293B;
}

.modal-body {
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.activity-info {
  display: flex;
  gap: 8px;
  align-items: center;
}

.activity-label {
  font-weight: 600;
  color: #64748B;
  font-size: 13px;
}

.activity-value {
  color: #1E293B;
  font-weight: 500;
}

.comment-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.comment-section label {
  font-weight: 600;
  color: #1E293B;
  font-size: 13px;
}

.comment-section textarea {
  border: 1px solid #E2E8F0;
  border-radius: 6px;
  padding: 12px;
  font-size: 13px;
  font-family: inherit;
  color: #1E293B;
  resize: vertical;
  transition: border-color 0.2s ease;
}

.comment-section textarea:focus {
  outline: none;
  border-color: #3B82F6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.modal-footer {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  padding: 16px 20px;
  border-top: 1px solid #E2E8F0;
}

.btn-cancel,
.btn-save {
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
}

.btn-cancel {
  background: white;
  color: #64748B;
  border: 1px solid #E2E8F0;
}

.btn-cancel:hover {
  background: #F8FAFC;
  border-color: #CBD5E1;
}

.btn-save {
  background: #3B82F6;
  color: white;
}

.btn-save:hover {
  background: #2563EB;
}

.activity-badge {
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.activity-badge:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

@media (max-width: 1200px) {
  .planning-grid {
    grid-template-columns: 130px repeat(7, minmax(80px, 1fr));
  }
}
</style>

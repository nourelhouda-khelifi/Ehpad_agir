<template>
  <div class="planning-daily">
    <!-- Header de page -->
    <div class="page-title-bar">
      <div>
        <h1 class="page-title">Planning du jour</h1>
        <p class="page-subtitle">{{ dateLabel }}</p>
      </div>
      <div class="page-actions">
        <button class="btn btn-secondary" @click="changeDay(-1)">‹</button>
        <button class="btn btn-secondary" @click="resetToday">Aujourd'hui</button>
        <button class="btn btn-secondary" @click="changeDay(1)">›</button>
        <div class="separator"></div>
        <div class="view-toggle">
          <button
            class="toggle-btn"
            :class="{ 'is-active': viewMode === 'as' }"
            @click="viewMode = 'as'"
          >
            Vue par AS
          </button>
          <button
            class="toggle-btn"
            :class="{ 'is-active': viewMode === 'patient' }"
            @click="viewMode = 'patient'"
          >
            Vue par patient
          </button>
        </div>
      </div>
    </div>

    <!-- Stats résumé -->
    <div class="stats-row">
      <div class="stat-item">
        <span class="stat-icon">📋</span>
        <div>
          <div class="stat-value">{{ filteredSoins.length }}</div>
          <div class="stat-label">Soins planifiés</div>
        </div>
      </div>
      <div class="stat-item">
        <span class="stat-icon">⏱️</span>
        <div>
          <div class="stat-value">{{ totalMinutes }}min</div>
          <div class="stat-label">Temps total</div>
        </div>
      </div>
      <div class="stat-item">
        <span class="stat-icon">👥</span>
        <div>
          <div class="stat-value">{{ patientsConcernes }}</div>
          <div class="stat-label">Patients concernés</div>
        </div>
      </div>
      <div class="stat-item is-warning" v-if="asEnSurcharge.length > 0">
        <span class="stat-icon">⚠️</span>
        <div>
          <div class="stat-value">{{ asEnSurcharge.join(', ') }}</div>
          <div class="stat-label">AS en surcharge</div>
        </div>
      </div>
    </div>

    <!-- Filtre d'activités -->
    <div class="filter-bar">
      <span class="filter-title">Filtrer par activité :</span>
      <div class="filter-pills">
        <button
          class="filter-pill"
          :class="{ 'is-active': filterType === 'all' }"
          @click="filterType = 'all'"
        >
          Tous
        </button>
        <button
          v-for="(config, key) in typesSoins"
          :key="key"
          class="filter-pill"
          :class="{ 'is-active': filterType === key }"
          @click="filterType = key"
          :style="{ borderColor: config.color, backgroundColor: filterType === key ? config.color + '20' : 'transparent' }"
        >
          {{ config.icon }} {{ config.label }}
        </button>
      </div>
    </div>

    <!-- Vue Kanban par AS -->
    <div v-if="viewMode === 'as'" class="kanban-grid">
      <ASColumn
        v-for="as in aidesSoignantsAvecCharge"
        :key="as.id"
        :as="as"
        :soins="getSoinsByAS(as.code)"
        @soin-click="handleSoinClick"
        @add-soin="handleAddSoin"
      />
    </div>

    <!-- Vue par patient (timeline) -->
    <div v-else class="timeline-view">
      <div class="timeline-grid">
        <div class="timeline-header">Patient</div>
        <div class="timeline-header">Matin (7h-12h)</div>
        <div class="timeline-header">Midi (12h-14h)</div>
        <div class="timeline-header">Après-midi (14h-18h)</div>
        <div class="timeline-header">Soir (18h-22h)</div>

        <template v-for="patient in patientsAvecSoins" :key="patient.id">
          <div class="timeline-patient">
            <div class="timeline-patient-name">{{ patient.nom }}</div>
            <div class="timeline-patient-room">{{ patient.chambre }}</div>
          </div>
          <div class="timeline-cell">
            <SoinCard
              v-for="soin in getSoinsByPatientAndPeriod(patient.id, 'matin')"
              :key="soin.id"
              :soin="soin"
              @click="handleSoinClick(soin)"
            />
          </div>
          <div class="timeline-cell">
            <SoinCard
              v-for="soin in getSoinsByPatientAndPeriod(patient.id, 'midi')"
              :key="soin.id"
              :soin="soin"
              @click="handleSoinClick(soin)"
            />
          </div>
          <div class="timeline-cell">
            <SoinCard
              v-for="soin in getSoinsByPatientAndPeriod(patient.id, 'apresmidi')"
              :key="soin.id"
              :soin="soin"
              @click="handleSoinClick(soin)"
            />
          </div>
          <div class="timeline-cell">
            <SoinCard
              v-for="soin in getSoinsByPatientAndPeriod(patient.id, 'soir')"
              :key="soin.id"
              :soin="soin"
              @click="handleSoinClick(soin)"
            />
          </div>
        </template>
      </div>
    </div>

    <!-- Légende -->
    <div class="legend">
      <span class="legend-title">Types de soins :</span>
      <div
        v-for="(config, key) in typesSoins"
        :key="key"
        class="legend-item"
      >
        <span class="legend-dot" :style="{ background: config.color }"></span>
        <span>{{ config.icon }} {{ config.label }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { mockAidesSoignants } from '@/data/mockAides.js'
import { mockSoinsJour, TYPES_SOINS } from '@/data/mockSoins.js'

import ASColumn from '@/components/planning/ASColumn.vue'
import SoinCard from '@/components/planning/SoinCard.vue'

const soins = ref(mockSoinsJour)
const currentDate = ref(new Date('2026-05-13'))
const viewMode = ref('as')
const filterType = ref('all')

const typesSoins = TYPES_SOINS

// Soins filtrés selon le type sélectionné
const filteredSoins = computed(() => {
  if (filterType.value === 'all') return soins.value
  return soins.value.filter(s => s.type === filterType.value)
})

// Date label
const dateLabel = computed(() => {
  const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }
  const formatted = currentDate.value.toLocaleDateString('fr-FR', options)
  return formatted.charAt(0).toUpperCase() + formatted.slice(1)
})

// Calcul de la charge dynamique pour cette journée
const aidesSoignantsAvecCharge = computed(() => {
  return mockAidesSoignants.map(as => {
    const soinsAS = filteredSoins.value.filter(s => s.asCode === as.code)
    const totalMinutes = soinsAS.reduce((sum, s) => sum + s.duree, 0)

    let niveau = 'leger'
    if (totalMinutes >= 120) niveau = 'surcharge'
    else if (totalMinutes >= 90) niveau = 'eleve'
    else if (totalMinutes >= 60) niveau = 'normal'

    return {
      ...as,
      chargeMinutes: totalMinutes,
      nbSoins: soinsAS.length,
      niveau
    }
  })
})

// Stats globales
const totalMinutes = computed(() =>
  filteredSoins.value.reduce((sum, s) => sum + s.duree, 0)
)

const patientsConcernes = computed(() =>
  new Set(filteredSoins.value.map(s => s.patientId)).size
)

const asEnSurcharge = computed(() =>
  aidesSoignantsAvecCharge.value
    .filter(as => as.niveau === 'surcharge')
    .map(as => as.code)
)

// Filtrer les soins par AS
const getSoinsByAS = (code) => {
  return filteredSoins.value.filter(s => s.asCode === code)
}

// Vue par patient
const patientsAvecSoins = computed(() => {
  const map = new Map()
  filteredSoins.value.forEach(s => {
    if (!map.has(s.patientId)) {
      map.set(s.patientId, {
        id: s.patientId,
        nom: s.patientNom,
        chambre: s.chambre
      })
    }
  })
  return [...map.values()].sort((a, b) => a.chambre.localeCompare(b.chambre))
})

const getSoinsByPatientAndPeriod = (patientId, period) => {
  return filteredSoins.value.filter(s => {
    if (s.patientId !== patientId) return false
    const heure = parseInt(s.heure.split(':')[0])
    if (period === 'matin') return heure >= 7 && heure < 12
    if (period === 'midi') return heure >= 12 && heure < 14
    if (period === 'apresmidi') return heure >= 14 && heure < 18
    if (period === 'soir') return heure >= 18 && heure < 22
    return false
  })
}

// Méthodes
const changeDay = (delta) => {
  const newDate = new Date(currentDate.value)
  newDate.setDate(newDate.getDate() + delta)
  currentDate.value = newDate
}

const resetToday = () => {
  currentDate.value = new Date('2026-05-13')
}

const handleSoinClick = (soin) => {
  console.log('Soin cliqué:', soin)
  // À implémenter : modal de détails ou édition
}

const handleAddSoin = (asCode) => {
  console.log('Ajouter soin pour:', asCode)
  // À implémenter : modal d'ajout
}
</script>

<style scoped>
.planning-daily {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 20px 24px;
}

/* Page header */
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
  text-transform: capitalize;
}

.page-actions {
  display: flex;
  gap: 8px;
  align-items: center;
}

.btn {
  padding: 8px 14px;
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

.separator {
  width: 1px;
  height: 20px;
  background: var(--color-border-light);
  margin: 0 4px;
}

/* Toggle view */
.view-toggle {
  display: flex;
  background: white;
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-md);
  padding: 2px;
}

.toggle-btn {
  padding: 6px 12px;
  font-size: 12px;
  font-weight: 500;
  color: var(--color-text-secondary);
  border-radius: var(--radius-sm);
  transition: all 0.15s ease;
}

.toggle-btn.is-active {
  background: var(--color-primary);
  color: white;
}

/* Stats row */
.stats-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  background: white;
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-border-light);
}

.stat-item.is-warning {
  background: var(--color-warning-light);
  border-color: var(--color-warning);
}

.stat-icon {
  font-size: 22px;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-bg-secondary);
  border-radius: var(--radius-md);
}

/* Filter bar */
.filter-bar {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: white;
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-lg);
  flex-wrap: wrap;
}

.filter-title {
  font-size: 12px;
  font-weight: 600;
  color: var(--color-text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  white-space: nowrap;
}

.filter-pills {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.filter-pill {
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

.filter-pill:hover {
  border-color: var(--color-primary);
  background: rgba(37, 99, 235, 0.05);
}

.filter-pill.is-active {
  background: var(--color-primary);
  color: white;
  border-color: var(--color-primary);
}

.stat-item.is-warning .stat-icon {
  background: white;
}

.stat-value {
  font-size: 18px;
  font-weight: 700;
  color: var(--color-text-primary);
}

.stat-item.is-warning .stat-value {
  color: var(--color-warning-dark);
}

.stat-label {
  font-size: 11px;
  color: var(--color-text-secondary);
}

/* Kanban grid */
.kanban-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 12px;
}

@media (max-width: 1200px) {
  .kanban-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 768px) {
  .kanban-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* Timeline view */
.timeline-view {
  background: white;
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-border-light);
  overflow: hidden;
}

.timeline-grid {
  display: grid;
  grid-template-columns: 200px repeat(4, 1fr);
}

.timeline-header {
  background: var(--color-bg-secondary);
  padding: 12px 14px;
  font-size: 12px;
  font-weight: 600;
  color: var(--color-text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-bottom: 1px solid var(--color-border-light);
}

.timeline-patient {
  padding: 12px 14px;
  border-top: 1px solid var(--color-border-light);
  background: var(--color-bg-tertiary);
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.timeline-patient-name {
  font-size: 13px;
  font-weight: 500;
}

.timeline-patient-room {
  font-size: 11px;
  color: var(--color-text-tertiary);
}

.timeline-cell {
  padding: 8px;
  border-top: 1px solid var(--color-border-light);
  border-left: 1px solid var(--color-border-light);
  display: flex;
  flex-direction: column;
  gap: 6px;
}

/* Legend */
.legend {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 12px 16px;
  background: white;
  border-radius: var(--radius-md);
  border: 1px solid var(--color-border-light);
  font-size: 12px;
  flex-wrap: wrap;
}

.legend-title {
  font-weight: 600;
  color: var(--color-text-secondary);
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 6px;
  color: var(--color-text-secondary);
}

.legend-dot {
  width: 10px;
  height: 10px;
  border-radius: 2px;
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
    flex-wrap: wrap;
  }

  .btn {
    flex: 1;
    min-width: 80px;
  }

  .separator {
    display: none;
  }

  .view-toggle {
    width: 100%;
  }

  .toggle-btn {
    flex: 1;
  }

  .kanban-grid {
    grid-template-columns: 1fr !important;
  }

  .timeline-grid {
    grid-template-columns: 140px repeat(3, 1fr) !important;
    font-size: 11px;
  }

  .timeline-patient-name {
    font-size: 12px;
  }

  .timeline-patient-room {
    font-size: 10px;
  }

  .timeline-header,
  .timeline-patient,
  .timeline-cell {
    padding: 8px 10px;
  }
}
</style>

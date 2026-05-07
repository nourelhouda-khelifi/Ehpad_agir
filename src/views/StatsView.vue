<template>
  <div class="stats-view">
    <!-- Header -->
    <div class="page-title-bar">
      <div>
        <h1 class="page-title">Statistiques & Rapports</h1>
        <p class="page-subtitle">Analyse de la charge et performance</p>
      </div>
      <div class="page-actions">
        <select v-model="periode" class="period-select">
          <option value="semaine">Semaine en cours</option>
          <option value="mois">Mois en cours</option>
          <option value="trimestre">3 derniers mois</option>
        </select>
        <button class="btn btn-primary" @click="exportPDF">
          📥 Export PDF
        </button>
      </div>
    </div>

    <!-- KPIs avec tendances -->
    <div class="kpis-grid">
      <div class="kpi-stat">
        <div class="kpi-stat-icon">📋</div>
        <div class="kpi-stat-content">
          <div class="kpi-stat-label">Total soins effectués</div>
          <div class="kpi-stat-value">{{ kpi.totalSoins.toLocaleString() }}</div>
          <div class="kpi-stat-trend trend-up">
            ↑ {{ pctEvolution(kpi.totalSoins, kpi.soinsPrecedent) }}% vs précédent
          </div>
        </div>
      </div>

      <div class="kpi-stat">
        <div class="kpi-stat-icon">✅</div>
        <div class="kpi-stat-content">
          <div class="kpi-stat-label">Taux de complétion</div>
          <div class="kpi-stat-value">{{ kpi.tauxCompletion }}%</div>
          <div class="kpi-stat-trend trend-up">
            ↑ {{ kpi.tauxCompletion - kpi.tauxPrecedent }}% vs précédent
          </div>
        </div>
      </div>

      <div class="kpi-stat">
        <div class="kpi-stat-icon">⏱️</div>
        <div class="kpi-stat-content">
          <div class="kpi-stat-label">Temps moyen / soin</div>
          <div class="kpi-stat-value">{{ kpi.tempsMoyen }} min</div>
          <div class="kpi-stat-trend trend-down">
            ↑ {{ kpi.tempsMoyen - kpi.tempsMoyenRef }} min vs référence
          </div>
        </div>
      </div>

      <div class="kpi-stat">
        <div class="kpi-stat-icon">⚖️</div>
        <div class="kpi-stat-content">
          <div class="kpi-stat-label">Équilibre charge AS</div>
          <div class="kpi-stat-value">{{ kpi.equilibreCharge }}%</div>
          <div class="kpi-stat-trend trend-warning">
            À améliorer
          </div>
        </div>
      </div>
    </div>

    <!-- Graphique charge AS -->
    <SectionCard title="Charge des AS sur la semaine" icon="📊">
      <BarChart
        :jours="chargeAS.jours"
        :series="seriesCharge"
        :threshold="120"
      />
    </SectionCard>

    <!-- Grille 2 colonnes : Camembert + Top patients -->
    <div class="grid-2">
      <SectionCard title="Répartition par type de soin" icon="🥧">
        <RepartitionChart :data="repartition" />
        <div class="repartition-summary">
          <span class="summary-total">{{ totalSoinsRepartition }} soins</span>
          <span class="summary-label">au total cette {{ periodeLabel }}</span>
        </div>
      </SectionCard>

      <SectionCard title="Top 5 patients les plus suivis" icon="🏆">
        <TopPatientsList :patients="topPatients" />
      </SectionCard>
    </div>

    <!-- Évolution sur 4 semaines -->
    <SectionCard title="Évolution du nombre de soins" icon="📈">
      <template #actions>
        <span class="section-meta">4 dernières semaines</span>
      </template>
      <LineChart :data="evolution" />
      <div class="evolution-insight">
        <span class="insight-icon">💡</span>
        <span class="insight-text">
          Progression de
          <strong>+{{ totalEvolution }} soins</strong>
          ({{ pctEvolutionTotal }}%) sur les 4 dernières semaines
        </span>
      </div>
    </SectionCard>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

import {
  mockStatsKPI,
  mockChargeASSemaine,
  mockRepartitionSoins,
  mockTopPatients,
  mockEvolution
} from '@/data/mockStats.js'

import SectionCard from '@/components/ui/SectionCard.vue'
import BarChart from '@/components/stats/BarChart.vue'
import LineChart from '@/components/stats/LineChart.vue'
import TopPatientsList from '@/components/stats/TopPatientsList.vue'
import RepartitionChart from '@/components/dashboard/RepartitionChart.vue'

const periode = ref('semaine')

const kpi = computed(() => mockStatsKPI[periode.value])

const periodeLabel = computed(() => {
  const labels = { semaine: 'semaine', mois: 'mois', trimestre: 'période' }
  return labels[periode.value]
})

const chargeAS = ref(mockChargeASSemaine)

// Convertir mockChargeASSemaine.data en format BarChart
const seriesCharge = computed(() => {
  const colors = {
    SE1: '#97C459',
    SE2: '#E24B4A',
    SC1: '#378ADD',
    SC2: '#5DCAA5',
    SG: '#888780'
  }
  return Object.entries(chargeAS.value.data).map(([code, values]) => ({
    code,
    color: colors[code],
    values
  }))
})

const repartition = ref(mockRepartitionSoins)

const totalSoinsRepartition = computed(() =>
  repartition.value.reduce((sum, item) => sum + item.count, 0)
)

const topPatients = ref(mockTopPatients)
const evolution = ref(mockEvolution)

const totalEvolution = computed(() => {
  const first = evolution.value[0].value
  const last = evolution.value[evolution.value.length - 1].value
  return last - first
})

const pctEvolutionTotal = computed(() => {
  const first = evolution.value[0].value
  const last = evolution.value[evolution.value.length - 1].value
  return Math.round(((last - first) / first) * 100)
})

const pctEvolution = (current, previous) => {
  if (!previous) return 0
  return Math.round(((current - previous) / previous) * 100)
}

const exportPDF = () => {
  alert('Export PDF — À implémenter avec une librairie comme jsPDF')
}
</script>

<style scoped>
.stats-view {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 20px;
}

/* Header */
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
  align-items: center;
}

.period-select {
  background: white;
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-md);
  padding: 9px 12px;
  font-size: 13px;
  color: var(--color-text-primary);
  cursor: pointer;
  outline: none;
  transition: border-color 0.15s ease;
}

.period-select:focus {
  border-color: var(--color-primary);
}

.btn {
  padding: 9px 16px;
  border-radius: var(--radius-md);
  font-size: 13px;
  font-weight: 500;
  transition: all 0.15s ease;
}

.btn-primary {
  background: var(--color-primary);
  color: white;
}

.btn-primary:hover {
  background: var(--color-primary-dark);
}

/* KPIs Grid */
.kpis-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
}

.kpi-stat {
  background: white;
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-lg);
  padding: 16px;
  display: flex;
  align-items: center;
  gap: 14px;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}

.kpi-stat:hover {
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

.kpi-stat-icon {
  font-size: 26px;
  width: 50px;
  height: 50px;
  background: var(--color-bg-tertiary);
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.kpi-stat-content {
  flex: 1;
  min-width: 0;
}

.kpi-stat-label {
  font-size: 11px;
  color: var(--color-text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.3px;
  margin-bottom: 2px;
}

.kpi-stat-value {
  font-size: 22px;
  font-weight: 700;
  color: var(--color-text-primary);
  line-height: 1.2;
}

.kpi-stat-trend {
  font-size: 11px;
  font-weight: 600;
  margin-top: 2px;
}

.trend-up {
  color: var(--color-success-dark);
}

.trend-down {
  color: var(--color-danger-dark);
}

.trend-warning {
  color: var(--color-warning-dark);
}

/* Grid 2 colonnes */
.grid-2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

/* Repartition summary */
.repartition-summary {
  margin-top: 16px;
  padding-top: 12px;
  border-top: 1px solid var(--color-border-light);
  text-align: center;
  font-size: 12px;
}

.summary-total {
  font-size: 18px;
  font-weight: 700;
  color: var(--color-primary);
  margin-right: 4px;
}

.summary-label {
  color: var(--color-text-secondary);
}

/* Section meta */
.section-meta {
  font-size: 12px;
  color: var(--color-text-secondary);
  font-weight: 500;
}

/* Evolution insight */
.evolution-insight {
  margin-top: 12px;
  padding: 10px 14px;
  background: var(--color-primary-light);
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: var(--color-primary);
}

.insight-icon {
  font-size: 16px;
}

.insight-text strong {
  font-weight: 700;
}

/* Responsive */
@media (max-width: 1024px) {
  .kpis-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  .grid-2 {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .kpis-grid {
    grid-template-columns: 1fr;
  }

  .page-title-bar {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .page-actions {
    width: 100%;
    flex-direction: column;
  }

  .period-select,
  .btn {
    width: 100%;
  }

  .kpi-stat {
    flex-direction: column;
    text-align: center;
  }

  .kpi-stat-icon {
    margin: 0 auto;
  }

  .evolution-insight {
    flex-direction: column;
    text-align: center;
  }
}
</style>

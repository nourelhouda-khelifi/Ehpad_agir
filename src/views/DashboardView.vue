<template>
  <div class="dashboard">
    <!-- ===================== -->
    <!-- SECTION RAPPORT       -->
    <!-- ===================== -->
    <div class="rapport-section">
      <div class="rapport-header">
        <h2 class="rapport-title">Rapport</h2>
        <button class="btn-telecharger">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="7 10 12 15 17 10"/>
            <line x1="12" y1="15" x2="12" y2="3"/>
          </svg>
          Télécharger
        </button>
      </div>

      <div class="rapport-cards">
        <!-- Total Patients -->
        <div class="rapport-card">
          <div class="rapport-icon-wrap" style="background: #DBEAFE;">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#2563EB" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
          </div>
          <div class="rapport-card-text">
            <span class="rapport-label">Total Patients</span>
            <span class="rapport-value">{{ stats.totalPatients }}</span>
          </div>
        </div>

        <div class="rapport-divider"></div>

        <!-- Etage 1 -->
        <div class="rapport-card">
          <div class="rapport-icon-wrap" style="background: #D1FAE5;">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#10B981" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
              <path d="M7 3.5A5 5 0 0 0 7 16.5" stroke-dasharray="2 2"/>
              <path d="M17 3.5A5 5 0 0 1 17 16.5" stroke-dasharray="2 2"/>
            </svg>
          </div>
          <div class="rapport-card-text">
            <span class="rapport-label">Total Patients Etage 1</span>
            <span class="rapport-value">{{ rapportData.etage1 }}</span>
          </div>
        </div>

        <div class="rapport-divider"></div>

        <!-- Etage 2 -->
        <div class="rapport-card">
          <div class="rapport-icon-wrap" style="background: #FFE4E1;">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#EF4444" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
              <path d="M7 3.5A5 5 0 0 0 7 16.5" stroke-dasharray="2 2"/>
              <path d="M17 3.5A5 5 0 0 1 17 16.5" stroke-dasharray="2 2"/>
            </svg>
          </div>
          <div class="rapport-card-text">
            <span class="rapport-label">Total Patients Etage 2</span>
            <span class="rapport-value">{{ rapportData.etage2 }}</span>
          </div>
        </div>

        <div class="rapport-divider"></div>

        <!-- Etage 3 -->
        <div class="rapport-card">
          <div class="rapport-icon-wrap" style="background: #FCE7F3;">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#EC4899" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
              <path d="M7 3.5A5 5 0 0 0 7 16.5" stroke-dasharray="2 2"/>
              <path d="M17 3.5A5 5 0 0 1 17 16.5" stroke-dasharray="2 2"/>
            </svg>
          </div>
          <div class="rapport-card-text">
            <span class="rapport-label">Total Patients Etage 3</span>
            <span class="rapport-value">{{ rapportData.etage3 }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- KPIs -->
    <div class="kpi-grid">
      <KPICard
        label="Patients total"
        :value="stats.totalPatients"
        subtitle="2 nouveaux cette semaine"
      />
      <KPICard
        label="Sans douche"
        :value="`${stats.sansDouche} ⚠️`"
        variant="danger"
        subtitle="Action requise"
      />
      <KPICard
        label="Soins aujourd'hui"
        :value="stats.soinsAujourdhui"
        trend="↑ 12%"
        subtitle="vs hier"
      />
      <KPICard
        label="Alertes actives"
        :value="stats.alertesActives"
        variant="warning"
        subtitle="3 critiques"
      />
    </div>

    <!-- Charge AS + Répartition -->
    <div class="dashboard-grid-2">
      <SectionCard title="Charge des Aides-Soignants" icon="⚖️">
        <template #actions>
          <span class="section-meta">Semaine 19</span>
        </template>
        <ChargeASList :aides="aidesSoignants" :charge-par-periode="mockChargePeriode" />
      </SectionCard>
      <SectionCard title="Répartition des soins" icon="🥧">
        <RepartitionChart :data="repartitionData" />
      </SectionCard>
    </div>

    <!-- Graphique charge AS -->
    <SectionCard title="Charge des AS sur la semaine" icon="📊">
      <BarChart
        :jours="chargeAS.jours"
        :series="seriesCharge"
        :threshold="120"
      />
    </SectionCard>

    <!-- Alertes -->
    <SectionCard title="Alertes critiques" icon="🚨">
      <template #actions>
        <button class="btn-link" @click="$router.push('/patients')">
          Voir tout →
        </button>
      </template>
      <div class="alertes-list">
        <AlertCard
          v-for="alerte in alertes"
          :key="alerte.id"
          :niveau="alerte.niveau"
          :title="alerte.patientNom + (alerte.chambre ? ` — ${alerte.chambre}` : '')"
          :message="alerte.message"
          action-label="Traiter"
          @action="handleAlerte(alerte)"
        />
      </div>
    </SectionCard>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import KPICard from '@/components/ui/KPICard.vue'
import SectionCard from '@/components/ui/SectionCard.vue'
import AlertCard from '@/components/ui/AlertCard.vue'
import BarChart from '@/components/stats/BarChart.vue'
import ChargeASList from '@/components/dashboard/ChargeASList.vue'
import RepartitionChart from '@/components/dashboard/RepartitionChart.vue'
import { mockAidesSoignants } from '@/data/mockAides.js'
import { mockPatients } from '@/data/mockPatients.js'
import { mockAlertes } from '@/data/mockAlertes.js'
import { mockChargeASSemaine } from '@/data/mockStats.js'
import { mockChargePeriode } from '@/data/mockChargeJour.js'

const router = useRouter()
const aidesSoignants = ref(mockAidesSoignants)
const patients = ref(mockPatients)
const alertes = ref(mockAlertes)

const stats = computed(() => ({
  totalPatients: patients.value.length,
  sansDouche: patients.value.filter(p => p.sansDouche).length,
  soinsAujourdhui: 124,
  alertesActives: alertes.value.length
}))

const repartitionData = ref([
  { label: 'Toilettes', count: 340, percentage: 40, color: '#378ADD' },
  { label: 'Douches', count: 212, percentage: 25, color: '#1D9E75' },
  { label: 'Repas', count: 169, percentage: 20, color: '#EF9F27' },
  { label: 'Couchers', count: 126, percentage: 15, color: '#7F77DD' }
])

// Rapport par étage — adapte ces valeurs à tes données réelles
const rapportData = ref({
  etage1: 20,
  etage2: 30,
  etage3: 20,
})

// Charge AS
const chargeAS = ref(mockChargeASSemaine)

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

const handleAlerte = (alerte) => {
  if (alerte.patientId) {
    router.push(`/patients/${alerte.patientId}`)
  }
}
</script>

<style scoped>
.dashboard {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 2rem;
}

.kpi-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

.dashboard-grid-2 {
  display: grid;
  grid-template-columns: 1.5fr 1fr;
  gap: 20px;
}

.alertes-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.section-meta {
  font-size: 12px;
  color: #94A3B8;
}

.btn-link {
  font-size: 12px;
  color: #2563EB;
  font-weight: 500;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
}

.btn-link:hover {
  text-decoration: underline;
}

/* ======================== */
/* RAPPORT SECTION          */
/* ======================== */
.rapport-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.rapport-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.rapport-title {
  font-size: 18px;
  font-weight: 700;
  color: #1E293B;
  margin: 0;
}

.btn-telecharger {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border: 1.5px solid #2563EB;
  border-radius: 10px;
  background: white;
  color: #2563EB;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.18s, color 0.18s;
}

.btn-telecharger:hover {
  background: #2563EB;
  color: white;
}

.btn-telecharger svg {
  flex-shrink: 0;
}

.rapport-cards {
  display: flex;
  align-items: center;
  background: #ffffff;
  border-radius: 20px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  padding: 8px 0;
  overflow: hidden;
}

.rapport-card {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px 28px;
}

.rapport-divider {
  width: 1px;
  height: 56px;
  background: #F1F5F9;
  flex-shrink: 0;
}

.rapport-icon-wrap {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.rapport-card-text {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.rapport-label {
  font-size: 12px;
  color: #94A3B8;
  font-weight: 400;
  white-space: nowrap;
}

.rapport-value {
  font-size: 28px;
  font-weight: 700;
  color: #1E293B;
  line-height: 1;
}

@media (max-width: 1024px) {
  .kpi-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  .dashboard-grid-2 {
    grid-template-columns: 1fr;
  }
  .rapport-cards {
    flex-direction: column;
    padding: 0;
  }
  .rapport-card {
    width: 100%;
    padding: 16px 20px;
  }
  .rapport-divider {
    width: 100%;
    height: 1px;
  }
}
</style>
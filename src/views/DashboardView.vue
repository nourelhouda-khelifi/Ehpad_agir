<template>
  <div class="dashboard">
    <!-- ===================== -->
    <!-- SECTION RAPPORT       -->
    <!-- ===================== -->
    <div class="rapport-section">
      <div class="rapport-header">
        <h2 class="rapport-title">Rapport</h2>
        <button class="btn-telecharger" @click="generatePDF()">
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
          <span class="section-meta">Semaine {{ currentWeek }}</span>
        </template>
        <ChargeASList :aides="aidesSoignants" :charge-par-periode="chargeAidesSoignants" />
      </SectionCard>
      <SectionCard title="Répartition des soins" icon="🥧">
        <RepartitionChart :data="repartitionData" />
      </SectionCard>
    </div>

    <!-- Graphique charge AS -->
    <SectionCard title="Charge des AS sur la semaine" icon="📊">
      <BarChart
        :jours="chargeASParSemaine.jours"
        :series="chargeASParSemaine.data"
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
          v-for="alerte in alertesCritiques"
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
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import autoTable from 'jspdf-autotable'
import KPICard from '@/components/ui/KPICard.vue'
import SectionCard from '@/components/ui/SectionCard.vue'
import AlertCard from '@/components/ui/AlertCard.vue'
import BarChart from '@/components/stats/BarChart.vue'
import ChargeASList from '@/components/dashboard/ChargeASList.vue'
import RepartitionChart from '@/components/dashboard/RepartitionChart.vue'
import { useDashboardStats } from '@/composables/useDashboardStats.js'

const router = useRouter()
const { patients, alertes, aidesSoignants, stats: dashboardStats, alertesCritiques, repartitionSoins, chargeAidesSoignants, chargeASParSemaine, loadDashboardData, loading } = useDashboardStats()

// Date de base pour le calcul des semaines
const baseWeekStart = new Date(2026, 4, 11)

// Calculer la semaine actuelle
const calculateCurrentWeek = () => {
  const today = new Date()
  const dayDiff = Math.floor((today - baseWeekStart) / (24 * 60 * 60 * 1000))
  return 19 + Math.floor(dayDiff / 7)
}

const currentWeek = ref(calculateCurrentWeek())

// Charger les données au montage
onMounted(() => {
  loadDashboardData()
})

const stats = computed(() => ({
  totalPatients: dashboardStats.value.totalPatients,
  sansDouche: dashboardStats.value.sansDouche,
  soinsAujourdhui: dashboardStats.value.soinsAujourdhui,
  alertesActives: dashboardStats.value.alertesActives
}))

// Rapport par étage
const rapportData = computed(() => ({
  etage1: dashboardStats.value.patientsByFloor[1] || 0,
  etage2: dashboardStats.value.patientsByFloor[2] || 0,
  etage3: dashboardStats.value.patientsByFloor[3] || 0,
}))

// Répartition des soins depuis les vraies données
const repartitionData = computed(() => {
  const data = repartitionSoins.value.map(item => ({
    label: item.label,
    count: item.count,
    percentage: item.percentage,
    color: getColorForSoin(item.label)
  }))
  return data.length > 0 ? data : [
    { label: 'Aucune donnée', count: 0, percentage: 0, color: '#E5E7EB' }
  ]
})

const getColorForSoin = (label) => {
  const colors = {
    'TOILETTE': '#378ADD',
    'DOUCHE': '#1D9E75',
    'REPAS': '#EF9F27',
    'COUCHER': '#7F77DD'
  }
  return colors[label?.toUpperCase()] || '#888780'
}

const seriesCharge = computed(() => {
  // Utiliser les données réelles du composable
  return chargeASParSemaine.value.data
})

const handleAlerte = (alerte) => {
  if (alerte.patientId) {
    router.push(`/patients/${alerte.patientId}`)
  }
}

// Génération du PDF récapitulatif
const generatePDF = async () => {
  const doc = new jsPDF('p', 'mm', 'a4')
  const pageWidth = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()
  const margin = 15
  let yPos = margin

  // Couleurs
  const primaryColor = [37, 99, 235] // #2563EB
  const lightGray = [241, 245, 249] // #F1F5F9
  const darkGray = [30, 41, 59] // #1E293B

  // En-tête
  doc.setFillColor(...primaryColor)
  doc.rect(0, 0, pageWidth, 25, 'F')
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(20)
  doc.setFont(undefined, 'bold')
  doc.text('EHPAD AGIR', margin, 17)
  doc.setFontSize(10)
  doc.setFont(undefined, 'normal')
  doc.text('Rapport de gestion', pageWidth - margin - 40, 17)

  // Date du rapport
  yPos = 35
  doc.setTextColor(...darkGray)
  doc.setFontSize(10)
  const today = new Date().toLocaleDateString('fr-FR', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })
  doc.text(`Date du rapport: ${today}`, margin, yPos)

  // Section Rapport - Statistiques
  yPos += 15
  doc.setFontSize(12)
  doc.setFont(undefined, 'bold')
  doc.text('Statistiques Générales', margin, yPos)

  yPos += 10
  doc.setFillColor(...lightGray)
  doc.setDrawColor(...primaryColor)
  doc.setLineWidth(0.5)

  const reportStats = [
    ['Métrique', 'Valeur'],
    ['Total Patients', stats.value.totalPatients.toString()],
    ['Patients Étage 1', rapportData.value.etage1.toString()],
    ['Patients Étage 2', rapportData.value.etage2.toString()],
    ['Patients Étage 3', rapportData.value.etage3.toString()],
    ['Sans douche (⚠️)', stats.value.sansDouche.toString()],
    ['Soins aujourd\'hui', stats.value.soinsAujourdhui.toString()],
    ['Alertes actives', stats.value.alertesActives.toString()]
  ]

  autoTable(doc, {
    startY: yPos,
    head: [reportStats[0]],
    body: reportStats.slice(1),
    margin: margin,
    headStyles: {
      fillColor: primaryColor,
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 10
    },
    bodyStyles: {
      fontSize: 9,
      textColor: darkGray
    },
    alternateRowStyles: {
      fillColor: [249, 250, 251]
    },
    columnStyles: {
      0: { cellWidth: 70 },
      1: { cellWidth: 40, halign: 'right' }
    }
  })

  yPos = doc.lastAutoTable.finalY + 15

  // Section Charge AS
  doc.setFontSize(12)
  doc.setFont(undefined, 'bold')
  doc.text('Charge des Aides-Soignants (Semaine)', margin, yPos)

  yPos += 10
  const chargeData = [
    ['Aide', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche']
  ]

  // Ajouter les données des aides
  aidesSoignants.value.forEach(aide => {
    const row = [aide.code]
    if (chargeAS.value.data[aide.code]) {
      chargeAS.value.data[aide.code].forEach(val => {
        row.push(val.toString())
      })
    }
    chargeData.push(row)
  })

  autoTable(doc, {
    startY: yPos,
    head: [chargeData[0]],
    body: chargeData.slice(1),
    margin: margin,
    headStyles: {
      fillColor: primaryColor,
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 9
    },
    bodyStyles: {
      fontSize: 8,
      textColor: darkGray
    },
    alternateRowStyles: {
      fillColor: [249, 250, 251]
    }
  })

  yPos = doc.lastAutoTable.finalY + 15

  // Section Répartition des soins
  if (yPos > pageHeight - 50) {
    doc.addPage()
    yPos = margin
  }

  doc.setFontSize(12)
  doc.setFont(undefined, 'bold')
  doc.text('Répartition des soins', margin, yPos)

  yPos += 10
  const repartitionTable = [
    ['Type de soin', 'Nombre', 'Pourcentage'],
    ...repartitionData.value.map(item => [
      item.label,
      item.count.toString(),
      `${item.percentage}%`
    ])
  ]

  autoTable(doc, {
    startY: yPos,
    head: [repartitionTable[0]],
    body: repartitionTable.slice(1),
    margin: margin,
    headStyles: {
      fillColor: primaryColor,
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 10
    },
    bodyStyles: {
      fontSize: 9,
      textColor: darkGray
    },
    alternateRowStyles: {
      fillColor: [249, 250, 251]
    },
    columnStyles: {
      1: { halign: 'center' },
      2: { halign: 'right' }
    }
  })

  yPos = doc.lastAutoTable.finalY + 15

  // Section Alertes critiques
  if (yPos > pageHeight - 60) {
    doc.addPage()
    yPos = margin
  }

  doc.setFontSize(12)
  doc.setFont(undefined, 'bold')
  doc.text('Alertes Critiques', margin, yPos)

  if (alertes.value.length > 0) {
    yPos += 10
    const alertesData = [
      ['Patient', 'Chambre', 'Niveau', 'Message']
    ]

    alertes.value.slice(0, 10).forEach(alerte => {
      alertesData.push([
        alerte.patientNom || 'N/A',
        alerte.chambre || 'N/A',
        alerte.niveau || 'Normal',
        alerte.message || ''
      ])
    })

    autoTable(doc, {
      startY: yPos,
      head: [alertesData[0]],
      body: alertesData.slice(1),
      margin: margin,
      headStyles: {
        fillColor: [239, 68, 68], // Rouge pour les alertes
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        fontSize: 9
      },
      bodyStyles: {
        fontSize: 8,
        textColor: darkGray
      },
      alternateRowStyles: {
        fillColor: [249, 250, 251]
      },
      columnStyles: {
        3: { cellWidth: 60 }
      }
    })
  } else {
    yPos += 10
    doc.setFontSize(9)
    doc.setTextColor(100, 100, 100)
    doc.text('Aucune alerte critique', margin, yPos)
  }

  // Pied de page
  const pageCount = doc.getNumberOfPages()
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i)
    doc.setFontSize(8)
    doc.setTextColor(150, 150, 150)
    doc.text(
      `Page ${i} sur ${pageCount}`,
      pageWidth / 2,
      pageHeight - 10,
      { align: 'center' }
    )
  }

  // Télécharger le PDF
  doc.save(`rapport-ehpad-${today.replace(/ /g, '-')}.pdf`)
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
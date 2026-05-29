<template>
  <div v-if="patient" class="patient-profile">
    <!-- Breadcrumb -->
    <div class="breadcrumb">
      <router-link to="/patients" class="breadcrumb-link">
        ← Patients
      </router-link>
      <span class="breadcrumb-sep">›</span>
      <span class="breadcrumb-current">
        {{ patient.nom }} {{ patient.prenom }}
      </span>
    </div>

    <!-- Header patient -->
    <div class="patient-header-actions">
      <div class="patient-info">
        <h1>{{ patient.nom }} {{ patient.prenom }}</h1>
        <p>Chambre {{ patient.numeroChambre }} - Étage {{ patient.etage }}</p>
      </div>
      <div class="header-actions-right">
        <button class="btn btn-secondary" @click="generatePatientPDF()">📥 Télécharger</button>
      </div>
    </div>

    <!-- Bandeau alertes -->
    <div v-if="alertesMessages.length > 0" class="alert-banner">
      <div v-for="msg in alertesMessages" :key="msg" class="alert-item">
        {{ msg }}
      </div>
    </div>

    <!-- Infos principales -->
    <div class="info-grid">
      <SectionCard title="Infos Patient" icon="👤">
        <InfoRow label="ID" :value="patient.id.toString()" />
        <InfoRow label="Chambre" :value="patient.numeroChambre" />
        <InfoRow label="Étage" :value="patient.etage.toString()" />
        <InfoRow label="Statut" :value="patient.statut || 'N/A'" />
        <InfoRow label="Catégorie" :value="patient.categorie || 'N/A'" />
      </SectionCard>

      <SectionCard title="Soins" icon="⏱️">
        <InfoRow label="Temps toilette lit" :value="(patient.tempsToiletteLit || 0) + ' min'" />
        <InfoRow label="Temps toilette vasque" :value="(patient.tempsToiletteVasque || 0) + ' min'" />
        <InfoRow label="Temps moyen toilette" :value="(patient.tempsToiletteMoyen || 0) + ' min'" />
        <InfoRow label="Temps moyen WC" :value="(patient.tempsWcMoyen || 0) + ' min'" />
        <InfoRow label="Temps moyen coucher" :value="(patient.tempsCoucherMoyen || 0) + ' min'" />
      </SectionCard>

      <SectionCard title="Besoins" icon="🏥">
        <InfoRow label="Aide soignant" :value="patient.aideSoignant ? 'Oui' : 'Non'" />
        <InfoRow label="Petit-déjeuner avec aide" :value="patient.petitDejeunerAide ? 'Oui' : 'Non'" />
        <InfoRow label="Sans douche" :value="patient.sansDouche ? 'Oui' : 'Non'" />
      </SectionCard>
    </div>
  </div>

  <!-- Patient introuvable -->
  <div v-else class="not-found">
    <span class="not-found-icon">😕</span>
    <h2>Patient introuvable</h2>
    <p>Ce patient n'existe pas ou a été supprimé.</p>
    <router-link to="/patients" class="btn-back">
      ← Retour à la liste
    </router-link>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

import SectionCard from '@/components/ui/SectionCard.vue'
import InfoRow from '@/components/ui/InfoRow.vue'

const route = useRoute()

const patient = ref(null)

// Fetch patient from API
onMounted(async () => {
  try {
    const patientId = route.params.id
    const response = await fetch(`http://localhost:8081/api/patients/${patientId}`)
    if (response.ok) {
      patient.value = await response.json()
    }
  } catch (error) {
    console.error('Erreur fetch patient:', error)
  }
})

// Génération automatique des messages d'alerte
const alertesMessages = computed(() => {
  if (!patient.value) return []
  const msgs = []

  // Vérifier sans douche
  if (patient.value.sansDouche) {
    msgs.push('⚠️ Pas de douche cette semaine')
  }

  return msgs
})

// Génération PDF de la fiche patient
const generatePatientPDF = () => {
  if (!patient.value) return
  const doc = new jsPDF('p', 'mm', 'a4')
  const pageWidth = doc.internal.pageSize.getWidth()
  const margin = 15

  // En-tête
  doc.setFontSize(16)
  doc.setFont(undefined, 'bold')
  const fullName = `${patient.value.nom || ''} ${patient.value.prenom || ''}`.trim()
  doc.text(fullName || 'Patient', margin, 20)
  doc.setFontSize(10)
  doc.setFont(undefined, 'normal')
  const today = new Date().toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })
  doc.text(`Date: ${today}`, pageWidth - margin, 20, { align: 'right' })

  // Infos patient
  const infoRows = [
    ['ID', patient.value.id || 'N/A'],
    ['Nom', patient.value.nom || ''],
    ['Prénom', patient.value.prenom || ''],
    ['Chambre', patient.value.numeroChambre || ''],
    ['Étage', patient.value.etage != null ? patient.value.etage.toString() : ''],
    ['Statut', patient.value.statut || ''],
    ['Sans douche', patient.value.sansDouche ? 'Oui' : 'Non']
  ]

  autoTable(doc, {
    startY: 28,
    head: [['Champ', 'Valeur']],
    body: infoRows,
    margin: margin,
    styles: { fontSize: 10 },
    headStyles: { fillColor: [37, 99, 235], textColor: [255, 255, 255] }
  })

  // Numérotation des pages
  const pageCount = doc.getNumberOfPages()
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i)
    doc.setFontSize(8)
    doc.setTextColor(130, 130, 130)
    doc.text(`Page ${i} / ${pageCount}`, pageWidth / 2, doc.internal.pageSize.getHeight() - 10, { align: 'center' })
  }

  doc.save(`fiche-patient-${(patient.value.nom || 'patient').replace(/\s+/g, '-')}-${new Date().toISOString().slice(0,10)}.pdf`)
}
</script>

<style scoped>
.patient-profile {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px 24px;
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

/* Breadcrumb */
.breadcrumb {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  padding: 8px 12px;
  background: rgba(37, 99, 235, 0.04);
  border-radius: var(--radius-md);
  border: 1px solid rgba(37, 99, 235, 0.1);
  width: fit-content;
  transition: all var(--transition-base);
}

.breadcrumb:hover {
  background: rgba(37, 99, 235, 0.08);
  border-color: rgba(37, 99, 235, 0.2);
}

.breadcrumb-link {
  color: var(--color-primary);
  font-weight: 600;
  text-decoration: none;
  transition: all var(--transition-fast);
  padding: 4px 8px;
  border-radius: var(--radius-sm);
  cursor: pointer;
}

.breadcrumb-link:hover {
  color: var(--color-primary-dark);
  background: rgba(37, 99, 235, 0.1);
}

.breadcrumb-sep {
  color: var(--color-text-tertiary);
  margin: 0 4px;
  opacity: 0.5;
}

.breadcrumb-current {
  color: var(--color-text-primary);
  font-weight: 600;
  padding: 4px 8px;
  border-radius: var(--radius-sm);
}

.patient-header-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.patient-info h1 {
  margin: 0;
  font-size: 24px;
  color: var(--color-text-primary);
}

.patient-info p {
  margin: 4px 0 0 0;
  color: var(--color-text-secondary);
  font-size: 14px;
}

.header-actions-right {
  display: flex;
  gap: 8px;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 16px;
}

.alert-banner {
  background: #fff3cd;
  border: 1px solid #ffc107;
  border-radius: var(--radius-md);
  padding: 12px 16px;
}

.alert-item {
  color: #856404;
  font-size: 14px;
  margin: 4px 0;
}

.not-found {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  padding: 60px 20px;
  text-align: center;
}

.not-found-icon {
  font-size: 48px;
}

.not-found h2 {
  margin: 0;
  color: var(--color-text-primary);
}

.not-found p {
  margin: 0;
  color: var(--color-text-secondary);
}

.btn-back {
  display: inline-block;
  padding: 8px 16px;
  background: var(--color-primary);
  color: white;
  text-decoration: none;
  border-radius: var(--radius-md);
  transition: all var(--transition-fast);
  cursor: pointer;
}

.btn-back:hover {
  background: var(--color-primary-dark);
}
</style>

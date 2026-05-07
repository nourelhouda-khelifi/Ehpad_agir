<template>
  <div v-if="patient" class="patient-profile">
    <!-- Breadcrumb -->
    <div class="breadcrumb">
      <router-link to="/patients" class="breadcrumb-link">
        ← Patients
      </router-link>
      <span class="breadcrumb-sep">›</span>
      <span class="breadcrumb-current">
        {{ patient.prenom ? 'Mme ' : 'Mr/Mme ' }}{{ patient.nom }} {{ patient.prenom }}
      </span>
    </div>

    <!-- Header patient -->
    <PatientHeader :patient="patient" />

    <!-- Bandeau alertes -->
    <PatientAlertBanner :alertes="alertesMessages" />

    <!-- Onglets -->
    <div class="profile-content">
      <Tabs v-model="activeTab" :tabs="tabs" />

      <div class="tab-panel">
        <!-- Onglet Douches -->
        <div v-if="activeTab === 'douches'" class="tab-douches">
          <DoucheCalendar
            :douches="patient.douches"
            @toggle-douche="handleToggleDouche"
          />

          <div class="info-grid">
            <SectionCard title="Données soins" icon="⏱️">
              <InfoRow label="Temps toilette lit" :value="patient.tempsToiletteLit + ' min'" />
              <InfoRow label="Temps toilette vasque" :value="patient.tempsToiletteVasque + ' min'" />
              <InfoRow label="Temps moyen" :value="patient.tempsToiletteMoyen + ' min'" highlighted />
              <InfoRow label="Aide soignant" :value="patient.aideSoignant ? 'Oui' : 'Non'" />
              <InfoRow label="Petit-déjeuner" :value="patient.petitDejeunerAide ? 'Avec aide' : 'Autonome'" />
            </SectionCard>

            <SectionCard title="Historique récent" icon="📜">
              <HistoriqueList :items="patient.historique" />
            </SectionCard>
          </div>
        </div>

        <!-- Onglet Soins matin -->
        <div v-if="activeTab === 'matin'" class="tab-matin">
          <SectionCard title="Soins du matin" icon="☀️">
            <InfoRow label="Temps toilette lit" :value="patient.tempsToiletteLit + ' min'" />
            <InfoRow label="Temps toilette vasque" :value="patient.tempsToiletteVasque + ' min'" />
            <InfoRow label="Temps moyen" :value="patient.tempsToiletteMoyen + ' min'" highlighted />
            <InfoRow label="Besoin aide soignant" :value="patient.aideSoignant ? 'Oui' : 'Non'" />
            <InfoRow label="Petit-déjeuner avec aide" :value="patient.petitDejeunerAide ? 'Oui' : 'Non'" />
            <InfoRow v-if="patient.commentairesMatin" label="Commentaires">
              <em>"{{ patient.commentairesMatin }}"</em>
            </InfoRow>
          </SectionCard>
        </div>

        <!-- Onglet WC -->
        <div v-if="activeTab === 'wc'" class="tab-wc">
          <SectionCard title="Toilettes WC" icon="🚽">
            <InfoRow label="WC 13h" :value="patient.wc13h ? 'Oui' : 'Non'" />
            <InfoRow label="WC 16h" :value="patient.wc16h ? 'Oui' : 'Non'" />
            <InfoRow label="NGT" :value="patient.ngt ? 'Oui' : 'Non'" />
          </SectionCard>
        </div>

        <!-- Onglet Sieste -->
        <div v-if="activeTab === 'sieste'" class="tab-sieste">
          <SectionCard title="Sieste" icon="😴">
            <InfoRow label="Mise sieste" :value="patient.miseSieste ? 'Oui' : 'Non'" />
            <InfoRow label="Lever sieste" :value="patient.leverSieste ? 'Oui' : 'Non'" />
          </SectionCard>
        </div>

        <!-- Onglet Couchers -->
        <div v-if="activeTab === 'couchers'" class="tab-couchers">
          <SectionCard title="Couchers" icon="🌙">
            <InfoRow label="Hélios" :value="patient.coucherHelios || 'Non assigné'" />
            <InfoRow label="Grande salle à manger" :value="patient.coucherSalle || 'Non assigné'" />
            <InfoRow label="Temps coucher Lit" :value="patient.tempsCoucherL + ' min'" />
            <InfoRow label="Temps coucher Vasque" :value="patient.tempsCoucherV + ' min'" />
          </SectionCard>
        </div>

        <!-- Onglet Notes -->
        <div v-if="activeTab === 'notes'" class="tab-notes">
          <SectionCard title="Notes & Commentaires" icon="💬">
            <NotesSection
              :notes="patient.notes"
              @add-note="handleAddNote"
            />
          </SectionCard>
        </div>
      </div>
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
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'

import PatientHeader from '@/components/patients/PatientHeader.vue'
import PatientAlertBanner from '@/components/patients/PatientAlertBanner.vue'
import DoucheCalendar from '@/components/patients/DoucheCalendar.vue'
import HistoriqueList from '@/components/patients/HistoriqueList.vue'
import NotesSection from '@/components/patients/NotesSection.vue'
import Tabs from '@/components/ui/Tabs.vue'
import SectionCard from '@/components/ui/SectionCard.vue'
import InfoRow from '@/components/ui/InfoRow.vue'

import { getPatientById } from '@/data/patientHelpers.js'

const route = useRoute()

const patient = ref(getPatientById(route.params.id))
const activeTab = ref('douches')

const tabs = [
  { id: 'douches', label: 'Douches', icon: '🛁' },
  { id: 'matin', label: 'Soins matin', icon: '☀️' },
  { id: 'wc', label: 'WC', icon: '🚽' },
  { id: 'sieste', label: 'Sieste', icon: '😴' },
  { id: 'couchers', label: 'Couchers', icon: '🌙' },
  { id: 'notes', label: 'Notes', icon: '💬' }
]

// Génération automatique des messages d'alerte
const alertesMessages = computed(() => {
  if (!patient.value) return []
  const msgs = []

  // Vérifier sans douche
  const douchesPlanifiees = Object.values(patient.value.douches).filter(d => d).length
  if (douchesPlanifiees === 0) {
    msgs.push('Aucune douche planifiée cette semaine')
  } else if (douchesPlanifiees < 2) {
    msgs.push(`Seulement ${douchesPlanifiees} douche planifiée cette semaine (recommandé : 2 minimum)`)
  }

  // Vérifier notes importantes
  const notesImportantes = patient.value.notes?.filter(n => n.important) || []
  notesImportantes.forEach(note => {
    msgs.push(`Commentaire critique : "${note.contenu}" — surveillance recommandée`)
  })

  return msgs
})

// Méthodes
const handleToggleDouche = (jour) => {
  // En statique, on simule juste l'ouverture du modal
  // Pour le moment on alterne vide/SE2 pour tester l'UI
  if (patient.value.douches[jour]) {
    patient.value.douches[jour] = null
  } else {
    patient.value.douches[jour] = 'SE2'
  }
}

const handleAddNote = ({ contenu, important }) => {
  const newId = (patient.value.notes.length || 0) + 1
  patient.value.notes.unshift({
    id: newId,
    date: new Date().toISOString().split('T')[0],
    auteur: 'Sophie P.',
    contenu,
    important
  })
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

/* Profile content */
.profile-content {
  background: white;
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-border-light);
  overflow: hidden;
  box-shadow: var(--shadow-sm);
  transition: box-shadow var(--transition-base);
  animation: slideUp var(--transition-slow) ease;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.profile-content:hover {
  box-shadow: var(--shadow-md);
}

.tab-panel {
  padding: 24px;
  animation: fadeIn var(--transition-base) ease;
}

/* Tab Douches grid */
.tab-douches {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

@media (max-width: 900px) {
  .info-grid {
    grid-template-columns: 1fr;
  }
}

/* Tab styles */
.tab-matin,
.tab-wc,
.tab-sieste,
.tab-couchers,
.tab-notes {
  display: flex;
  flex-direction: column;
  gap: 20px;
  animation: fadeIn var(--transition-base) ease;
}

/* Not found */
.not-found {
  text-align: center;
  padding: 120px 20px;
  background: linear-gradient(135deg, #F8FAFC 0%, #EFF6FF 100%);
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-border-light);
  box-shadow: var(--shadow-sm);
  animation: slideUp var(--transition-slow) ease;
}

.not-found-icon {
  font-size: 64px;
  display: block;
  margin-bottom: 20px;
  animation: bounce 2s ease-in-out infinite;
}

@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

.not-found h2 {
  font-size: 24px;
  font-weight: 700;
  color: var(--color-text-primary);
  margin-bottom: 12px;
}

.not-found p {
  color: var(--color-text-secondary);
  margin-bottom: 24px;
  font-size: 14px;
}

.btn-back {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: linear-gradient(135deg, var(--color-primary) 0%, #1D4ED8 100%);
  color: white;
  padding: 12px 24px;
  border-radius: var(--radius-md);
  font-size: 13px;
  font-weight: 600;
  text-decoration: none;
  transition: all var(--transition-base);
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
  border: none;
  cursor: pointer;
}

.btn-back:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(37, 99, 235, 0.4);
}

.btn-back:active {
  transform: translateY(0);
  box-shadow: 0 2px 8px rgba(37, 99, 235, 0.3);
}
</style>
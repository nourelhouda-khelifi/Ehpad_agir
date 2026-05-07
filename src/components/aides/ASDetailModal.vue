<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-content">
      <!-- Header -->
      <div class="modal-header" :style="{ background: as.color }">
        <div class="header-info">
          <div class="header-avatar">{{ as.code }}</div>
          <div>
            <h2 class="header-title">{{ as.code }}</h2>
            <p class="header-subtitle">Secteur {{ as.secteur }} · Semaine 19</p>
          </div>
        </div>
        <button class="close-btn" @click="$emit('close')">✕</button>
      </div>

      <!-- Stats résumé -->
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-card-value">{{ as.chargeMinutes }}min</div>
          <div class="stat-card-label">Charge totale</div>
        </div>
        <div class="stat-card">
          <div class="stat-card-value">{{ as.nbPatients }}</div>
          <div class="stat-card-label">Patients</div>
        </div>
        <div class="stat-card">
          <div class="stat-card-value">{{ as.nbSoins }}</div>
          <div class="stat-card-label">Soins planifiés</div>
        </div>
        <div class="stat-card" :class="`niveau-${as.niveau}`">
          <div class="stat-card-value-text">{{ niveauLabel }}</div>
          <div class="stat-card-label">Niveau de charge</div>
        </div>
      </div>

      <!-- Charge par jour -->
      <div class="section">
        <h3 class="section-title">📊 Charge par jour</h3>
        <div class="day-bars">
          <div
            v-for="(minutes, jour) in chargeJour"
            :key="jour"
            class="day-bar"
          >
            <div class="day-bar-label">{{ jourLabel(jour) }}</div>
            <div class="day-bar-track">
              <div
                class="day-bar-fill"
                :style="{
                  height: getBarHeight(minutes) + '%',
                  background: getBarColor(minutes)
                }"
              ></div>
            </div>
            <div class="day-bar-value">{{ minutes }}min</div>
          </div>
        </div>
      </div>

      <!-- Liste des patients -->
      <div class="section">
        <h3 class="section-title">👥 Patients suivis ({{ patients.length }})</h3>
        <div v-if="patients.length === 0" class="empty">
          Aucun patient assigné à cet AS
        </div>
        <div v-else class="patients-list">
          <div
            v-for="patient in patients"
            :key="patient.id"
            class="patient-item"
          >
            <div class="patient-info">
              <div class="patient-name">{{ patient.nom }}</div>
              <div class="patient-room">{{ patient.chambre }}</div>
            </div>
            <div class="patient-soins">
              <span class="soins-count">{{ patient.soinsParSemaine }}</span>
              <span class="soins-label">soins/sem</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="modal-footer">
        <button class="btn btn-secondary" @click="$emit('close')">Fermer</button>
        <button class="btn btn-primary">Voir planning complet</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  as: { type: Object, required: true },
  chargeJour: { type: Object, required: true },
  patients: { type: Array, required: true }
})

defineEmits(['close'])

const niveauLabel = computed(() => {
  const labels = {
    leger: '🟢 Léger',
    normal: '🟡 Normal',
    eleve: '🟠 Élevé',
    surcharge: '🔴 Surchargé'
  }
  return labels[props.as.niveau]
})

const jourLabel = (jour) => {
  const labels = {
    lundi: 'Lun', mardi: 'Mar', mercredi: 'Mer', jeudi: 'Jeu',
    vendredi: 'Ven', samedi: 'Sam', dimanche: 'Dim'
  }
  return labels[jour]
}

const getBarHeight = (minutes) => {
  return Math.min((minutes / 140) * 100, 100)
}

const getBarColor = (minutes) => {
  if (minutes < 60) return '#97C459'
  if (minutes < 90) return '#5DCAA5'
  if (minutes < 120) return '#EF9F27'
  return '#E24B4A'
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.2s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.modal-content {
  background: white;
  border-radius: var(--radius-lg);
  width: 580px;
  max-width: 90vw;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.2);
  animation: slideUp 0.25s ease;
}

@keyframes slideUp {
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

/* Header */
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  color: white;
}

.header-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.header-avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  font-size: 14px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
}

.header-title {
  font-size: 18px;
  font-weight: 700;
}

.header-subtitle {
  font-size: 12px;
  opacity: 0.9;
}

.close-btn {
  font-size: 18px;
  color: white;
  padding: 4px 8px;
  border-radius: var(--radius-sm);
  transition: background 0.15s ease;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}

/* Stats grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
  padding: 20px;
  border-bottom: 1px solid var(--color-border-light);
}

.stat-card {
  background: var(--color-bg-tertiary);
  padding: 12px;
  border-radius: var(--radius-md);
  text-align: center;
}

.stat-card.niveau-surcharge {
  background: var(--color-danger-light);
}

.stat-card-value {
  font-size: 18px;
  font-weight: 700;
  color: var(--color-text-primary);
  margin-bottom: 2px;
}

.stat-card-value-text {
  font-size: 13px;
  font-weight: 700;
  color: var(--color-text-primary);
  margin-bottom: 2px;
}

.stat-card-label {
  font-size: 10px;
  color: var(--color-text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.3px;
}

/* Section */
.section {
  padding: 20px;
  border-bottom: 1px solid var(--color-border-light);
}

.section-title {
  font-size: 13px;
  font-weight: 600;
  color: var(--color-text-primary);
  margin-bottom: 12px;
}

/* Day bars */
.day-bars {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 6px;
  height: 120px;
  align-items: end;
}

.day-bar {
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
  justify-content: flex-end;
  gap: 4px;
}

.day-bar-track {
  width: 100%;
  flex: 1;
  background: var(--color-bg-secondary);
  border-radius: var(--radius-sm);
  display: flex;
  align-items: flex-end;
  overflow: hidden;
  min-height: 60px;
}

.day-bar-fill {
  width: 100%;
  border-radius: var(--radius-sm) var(--radius-sm) 0 0;
  transition: height 0.3s ease;
  min-height: 4px;
}

.day-bar-label {
  font-size: 10px;
  color: var(--color-text-secondary);
  font-weight: 500;
  order: -1;
}

.day-bar-value {
  font-size: 10px;
  color: var(--color-text-tertiary);
  font-weight: 600;
}

/* Patients list */
.patients-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.patient-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 12px;
  background: var(--color-bg-tertiary);
  border-radius: var(--radius-md);
}

.patient-name {
  font-size: 13px;
  font-weight: 500;
  color: var(--color-text-primary);
}

.patient-room {
  font-size: 11px;
  color: var(--color-text-secondary);
}

.patient-soins {
  display: flex;
  align-items: baseline;
  gap: 4px;
}

.soins-count {
  font-size: 16px;
  font-weight: 700;
  color: var(--color-primary);
}

.soins-label {
  font-size: 10px;
  color: var(--color-text-secondary);
}

.empty {
  text-align: center;
  padding: 20px;
  color: var(--color-text-tertiary);
  font-size: 13px;
  font-style: italic;
}

/* Footer */
.modal-footer {
  display: flex;
  gap: 8px;
  padding: 16px 20px;
  background: var(--color-bg-tertiary);
}

.btn {
  flex: 1;
  padding: 10px 16px;
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
  border-color: var(--color-text-secondary);
}

.btn-primary {
  background: var(--color-primary);
  color: white;
}

.btn-primary:hover {
  background: var(--color-primary-dark);
}
</style>

<template>
  <div class="patients-table">
    <!-- Header -->
    <div class="table-header">
      <div class="th col-chambre" @click="$emit('sort', 'chambre')">
        Chambre
        <span class="sort-icon">{{ getSortIcon('chambre') }}</span>
      </div>
      <div class="th col-nom" @click="$emit('sort', 'nom')">
        Nom Prénom
        <span class="sort-icon">{{ getSortIcon('nom') }}</span>
      </div>
      <div class="th col-soin">Prochain soin</div>
      <div class="th col-wc">Temps moyen WC</div>
      <div class="th col-coucher">Temps moyen coucher</div>
      <div class="th col-alertes">Alertes</div>
      <div class="th col-actions">Actions</div>
    </div>

    <!-- Empty state -->
    <div v-if="patients.length === 0" class="empty-state">
      <span class="empty-icon">🔍</span>
      <p>Aucun patient trouvé</p>
      <span class="empty-hint">Essayez de modifier vos filtres</span>
    </div>

    <!-- Rows -->
    <div
      v-for="patient in patients"
      :key="patient.id"
      class="table-row"
      :class="`etage-${patient.etage}`"
      @click="$emit('open-patient', patient.id)"
    >
      <div class="td col-chambre">{{ patient.chambre }}</div>
      <div class="td col-nom">
        <div class="patient-name" :class="{ 'has-alert': patient.sansDouche }">
          <span v-if="patient.sansDouche" class="alert-icon">⚠️</span>
          {{ formatName(patient) }}
        </div>
      </div>
      <div class="td col-soin">
        <span v-if="patient.sansDouche" class="text-danger">
          ⚠️ Sans douche
        </span>
        <span v-else-if="patient.prochainSoin" class="text-secondary">
          {{ getIconSoin(patient.prochainSoin.type) }}
          {{ patient.prochainSoin.jour }} {{ patient.prochainSoin.heure }}
        </span>
        <span v-else class="empty-value">—</span>
      </div>
      <div class="td col-wc">
        <span v-if="patient.tempsWCMoyen > 0" class="text-secondary">
          {{ patient.tempsWCMoyen }} min
        </span>
        <span v-else class="empty-value">—</span>
      </div>
      <div class="td col-coucher">
        <span v-if="patient.tempsCoucherMoyen > 0" class="text-secondary">
          {{ patient.tempsCoucherMoyen }} min
        </span>
        <span v-else class="empty-value">—</span>
      </div>
      <div class="td col-alertes">
        <span
          v-if="patient.alertes > 0"
          class="alert-badge"
          :class="{ 'critique': patient.sansDouche }"
        >
          {{ patient.alertes }} {{ patient.sansDouche ? 'critique' : (patient.alertes > 1 ? 'alertes' : 'alerte') }}
        </span>
        <span v-else-if="patient.hasNote" class="alert-badge note">
          Note
        </span>
        <span v-else class="empty-value">—</span>
      </div>
      <div class="td col-actions" @click.stop>
        <button class="action-btn" @click="$emit('open-patient', patient.id)" title="Voir">
          👁️
        </button>
        <button class="action-btn" title="Modifier">
          ✏️
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import ASBadge from '@/components/ui/ASBadge.vue'

const props = defineProps({
  patients: { type: Array, required: true },
  sortKey: { type: String, default: '' },
  sortOrder: { type: String, default: 'asc' }
})

defineEmits(['open-patient', 'sort'])

const formatName = (patient) => {
  const titre = patient.prenom ? '' : 'Mr/Mme '
  return `${titre}${patient.nom}${patient.prenom ? ' ' + patient.prenom : ''}`
}

const getIconSoin = (type) => {
  const icons = {
    douche: '🛁',
    toilette: '🚿',
    wc: '🚽',
    coucher: '🌙',
    repas: '🍽️'
  }
  return icons[type] || '•'
}

const getSortIcon = (key) => {
  if (props.sortKey !== key) return '⇅'
  return props.sortOrder === 'asc' ? '↑' : '↓'
}
</script>

<style scoped>
.patients-table {
  background: white;
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-border-light);
  overflow: hidden;
}

/* Grid layout pour les colonnes */
.table-header,
.table-row {
  display: grid;
  grid-template-columns: 100px 1fr 160px 130px 150px 110px 90px;
  align-items: center;
}

.table-header {
  background: var(--color-bg-secondary);
  font-size: 12px;
  font-weight: 600;
  color: var(--color-text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.th {
  padding: 12px 16px;
  cursor: pointer;
  user-select: none;
  display: flex;
  align-items: center;
  gap: 4px;
}

.th:hover {
  color: var(--color-text-primary);
}

.sort-icon {
  font-size: 11px;
  color: var(--color-text-tertiary);
}

/* Rows */
.table-row {
  font-size: 13px;
  border-top: 1px solid var(--color-border-light);
  cursor: pointer;
  transition: background 0.1s ease;
}

.table-row:hover {
  background: var(--color-bg-tertiary);
}

.etage-1 {
  background: var(--color-etage-1);
}

.etage-1:hover {
  background: #FFF8B8;
}

.etage-2 {
  background: var(--color-etage-2);
}

.etage-2:hover {
  background: #F5DCB1;
}

.td {
  padding: 12px 16px;
}

/* Patient name */
.patient-name {
  font-weight: 500;
  color: var(--color-text-primary);
  display: flex;
  align-items: center;
  gap: 6px;
}

.patient-name.has-alert {
  color: var(--color-danger-dark);
}

.alert-icon {
  font-size: 14px;
}

/* Étage column */
.col-etage {
  font-size: 12px;
  color: var(--color-text-secondary);
}

/* WC and Coucher columns */
.col-wc,
.col-coucher {
  font-size: 12px;
  color: var(--color-text-secondary);
  text-align: center;
}

/* Soin column */
.text-secondary {
  color: var(--color-text-secondary);
  font-size: 12px;
}

.text-danger {
  color: var(--color-danger-dark);
  font-weight: 500;
  font-size: 12px;
}

/* Alert badges */
.alert-badge {
  display: inline-block;
  font-size: 11px;
  font-weight: 600;
  padding: 3px 9px;
  border-radius: var(--radius-full);
  background: var(--color-danger-light);
  color: var(--color-danger-dark);
}

.alert-badge.critique {
  background: var(--color-danger);
  color: white;
}

.alert-badge.note {
  background: var(--color-warning-light);
  color: var(--color-warning-dark);
}

.empty-value {
  color: var(--color-text-tertiary);
}

/* Actions */
.col-actions {
  display: flex;
  gap: 6px;
  justify-content: flex-end;
}

.action-btn {
  padding: 6px 8px;
  border-radius: var(--radius-sm);
  font-size: 14px;
  transition: background 0.15s ease;
}

.action-btn:hover {
  background: rgba(0, 0, 0, 0.06);
}

/* Empty state */
.empty-state {
  padding: 60px 20px;
  text-align: center;
  color: var(--color-text-secondary);
}

.empty-icon {
  font-size: 36px;
  display: block;
  margin-bottom: 12px;
  opacity: 0.5;
}

.empty-state p {
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 4px;
}

.empty-hint {
  font-size: 12px;
  color: var(--color-text-tertiary);
}
</style>
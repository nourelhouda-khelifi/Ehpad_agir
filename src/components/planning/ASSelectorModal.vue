<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-content">
      <div class="modal-header">
        <div class="modal-title-area">
          <h2 class="modal-title">Assigner un Aide-Soignant</h2>
          <p class="modal-subtitle">
            <strong>{{ patientNom }}</strong> · {{ jourLabel }} · Douche
          </p>
        </div>
        <button class="close-btn" @click="$emit('close')">✕</button>
      </div>

      <div v-if="recommandation && !asActuel" class="reco-banner">
        <span class="reco-icon">✨</span>
        <div class="reco-content">
          <div class="reco-title">Recommandation</div>
          <div class="reco-message">
            <strong>{{ recommandation.code }}</strong> est l'AS le moins chargé cette semaine ({{ recommandation.chargeMinutes }} min)
          </div>
        </div>
      </div>

      <div v-if="asActuel" class="current-banner">
        <span>Actuellement assigné : <strong>{{ asActuel }}</strong></span>
        <button class="btn-remove" @click="handleRemove">🗑️ Retirer l'assignation</button>
      </div>

      <div class="section-label">Charge actuelle (Semaine {{ semaine }})</div>

      <div class="as-list">
        <div
          v-for="as in aidesAvecCharge"
          :key="as.id"
          class="as-item"
          :class="{
            'is-selected': selectedAS === as.code,
            'is-recommended': recommandation?.code === as.code && !asActuel,
            'is-overload': as.niveau === 'surcharge'
          }"
          @click="selectedAS = as.code"
        >
          <input
            :id="`as-${as.code}`"
            v-model="selectedAS"
            type="radio"
            :value="as.code"
            class="as-radio"
          />

          <label :for="`as-${as.code}`" class="as-label">
            <div class="as-code">
              <ASBadge :code="as.code" />
            </div>

            <div class="as-charge">
              <ChargeBar :minutes="as.chargeMinutes" />
              <div class="as-meta">
                <span>{{ as.chargeMinutes }} min · {{ as.nbPatients }} patient(s)</span>
                <span v-if="recommandation?.code === as.code && !asActuel" class="reco-tag">✨ Recommandé</span>
              </div>
            </div>

            <div class="as-niveau" :class="`niveau-${as.niveau}`">{{ as.labelNiveau }}</div>
          </label>
        </div>
      </div>

      <div class="modal-footer">
        <button class="btn btn-secondary" @click="$emit('close')">Annuler</button>
        <button class="btn btn-primary" :disabled="!selectedAS || selectedAS === asActuel" @click="handleConfirm">
          {{ asActuel ? 'Modifier' : 'Confirmer' }}<span v-if="selectedAS"> {{ selectedAS }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import ChargeBar from '@/components/ui/ChargeBar.vue'
import ASBadge from '@/components/ui/ASBadge.vue'

const props = defineProps({
  patientNom: { type: String, required: true },
  jour: { type: String, required: true },
  semaine: { type: Number, default: 19 },
  asActuel: { type: String, default: null },
  aidesAvecCharge: { type: Array, required: true },
  recommandation: { type: Object, default: null }
})

const emit = defineEmits(['close', 'confirm', 'remove'])
const selectedAS = ref(props.asActuel || props.recommandation?.code || null)

const jourLabel = computed(() => {
  const jours = {
    lundi: 'Lundi 11 mai',
    mardi: 'Mardi 12 mai',
    mercredi: 'Mercredi 13 mai',
    jeudi: 'Jeudi 14 mai',
    vendredi: 'Vendredi 15 mai',
    samedi: 'Samedi 16 mai',
    dimanche: 'Dimanche 17 mai'
  }
  return jours[props.jour] || props.jour
})

const handleConfirm = () => {
  if (selectedAS.value) {
    emit('confirm', selectedAS.value)
  }
}

const handleRemove = () => {
  emit('remove')
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.5);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn var(--transition-base) ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.modal-content {
  background: white;
  border-radius: var(--radius-lg);
  width: 560px;
  max-width: calc(100vw - 32px);
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: var(--shadow-xl);
  animation: slideUp var(--transition-base) ease;
}

@keyframes slideUp {
  from {
    transform: translateY(18px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
  padding: 20px 24px 16px;
  border-bottom: 1px solid var(--color-border-light);
}

.modal-title {
  font-size: 18px;
  font-weight: 700;
  color: var(--color-text-primary);
  margin-bottom: 4px;
}

.modal-subtitle {
  font-size: 13px;
  color: var(--color-text-secondary);
}

.close-btn {
  font-size: 18px;
  color: var(--color-text-tertiary);
  padding: 4px 8px;
  border-radius: var(--radius-sm);
  transition: all var(--transition-fast);
}

.close-btn:hover {
  background: var(--color-bg-secondary);
  color: var(--color-text-primary);
}

.reco-banner {
  display: flex;
  gap: 12px;
  padding: 14px 24px;
  background: linear-gradient(135deg, #DCFCE7 0%, #D1FAE5 100%);
  border-bottom: 1px solid var(--color-border-light);
}

.reco-icon {
  font-size: 18px;
}

.reco-title {
  font-size: 12px;
  font-weight: 700;
  color: var(--color-success-dark);
  margin-bottom: 2px;
}

.reco-message {
  font-size: 12px;
  color: var(--color-success-dark);
}

.current-banner {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  padding: 12px 24px;
  background: var(--color-primary-light);
  font-size: 13px;
  color: var(--color-primary);
  border-bottom: 1px solid var(--color-border-light);
}

.btn-remove {
  font-size: 12px;
  color: var(--color-danger);
  font-weight: 600;
  padding: 5px 10px;
  border-radius: var(--radius-sm);
  transition: all var(--transition-fast);
}

.btn-remove:hover {
  background: var(--color-danger-light);
}

.section-label {
  padding: 16px 24px 10px;
  font-size: 11px;
  font-weight: 700;
  color: var(--color-text-tertiary);
  text-transform: uppercase;
  letter-spacing: 0.6px;
}

.as-list {
  padding: 0 24px 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.as-item {
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all var(--transition-base);
  background: white;
  box-shadow: var(--shadow-xs);
}

.as-item:hover {
  border-color: var(--color-primary);
  background: var(--color-bg-tertiary);
  box-shadow: var(--shadow-sm);
  transform: translateY(-1px);
}

.as-item.is-selected {
  border-color: var(--color-primary);
  background: var(--color-primary-light);
  box-shadow: var(--shadow-sm);
}

.as-item.is-recommended {
  border-color: var(--color-success);
  background: var(--color-success-light);
}

.as-item.is-overload {
  opacity: 0.72;
}

.as-radio {
  display: none;
}

.as-label {
  display: grid;
  grid-template-columns: 64px 1fr auto;
  gap: 14px;
  align-items: center;
  padding: 14px 16px;
  cursor: pointer;
}

.as-code {
  display: flex;
  align-items: center;
}

.as-charge {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.as-meta {
  display: flex;
  justify-content: space-between;
  gap: 8px;
  font-size: 11px;
  color: var(--color-text-secondary);
}

.reco-tag {
  color: var(--color-success-dark);
  font-weight: 700;
}

.as-niveau {
  font-size: 11px;
  font-weight: 700;
  padding: 4px 10px;
  border-radius: var(--radius-full);
  white-space: nowrap;
}

.niveau-leger {
  background: var(--color-success-light);
  color: var(--color-success-dark);
}

.niveau-normal {
  background: #FEF3C7;
  color: #854D0E;
}

.niveau-eleve {
  background: var(--color-warning-light);
  color: var(--color-warning-dark);
}

.niveau-surcharge {
  background: var(--color-danger-light);
  color: var(--color-danger-dark);
}

.modal-footer {
  display: flex;
  gap: 10px;
  padding: 16px 24px 20px;
  border-top: 1px solid var(--color-border-light);
  background: var(--color-bg-tertiary);
}

.btn {
  flex: 1;
  padding: 10px 16px;
  border-radius: var(--radius-md);
  font-size: 13px;
  font-weight: 600;
  transition: all var(--transition-base);
  cursor: pointer;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-secondary {
  background: white;
  border: 1px solid var(--color-border-light);
  color: var(--color-text-primary);
}

.btn-secondary:hover:not(:disabled) {
  border-color: var(--color-primary);
  color: var(--color-primary);
}

.btn-primary {
  background: linear-gradient(135deg, var(--color-primary) 0%, #1D4ED8 100%);
  color: white;
  border: 1px solid var(--color-primary);
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.25);
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 6px 16px rgba(37, 99, 235, 0.35);
}
</style>

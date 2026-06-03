<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-content">
      <div class="modal-header">
        <div class="modal-title-area">
          <h2 class="modal-title">Assigner un Aide-Soignant</h2>
          <p class="modal-subtitle">
            <strong>{{ patientNom }}</strong> · {{ jourLabel }} · {{ activiteLabel }}
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

      <div class="section-label">Type d'assignation</div>
      <div class="type-control">
        <button
          type="button"
          class="type-btn"
          :class="{ 'is-active': assignmentType === 'single' }"
          @click="assignmentType = 'single'; selectedAS2 = null"
        >
          👤 1 Aide
        </button>
        <button
          type="button"
          class="type-btn"
          :class="{ 'is-active': assignmentType === 'shared' }"
          @click="assignmentType = 'shared'"
        >
          👥 2 Aides
        </button>
      </div>

      <div class="section-label" style="margin-top: 20px;">Charge actuelle (Semaine {{ semaine }})</div>

      <div class="as-list">
        <div
          v-for="as in aidesAvecCharge"
          :key="as.id"
          class="as-item"
          :class="{
            'is-selected': selectedAS === as.code,
            'is-selected-2': selectedAS2 === as.code,
            'is-recommended': recommandation?.code === as.code && !asActuel,
            'is-overload': as.niveau === 'surcharge'
          }"
          @click="selectedAS = as.code"
        >
          <input
            :id="`as-${as.code}`"
            :checked="selectedAS === as.code"
            type="radio"
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

      <div v-if="assignmentType === 'shared'" class="section-label" style="margin-top: 20px;">2ème Aide</div>
      <div v-if="assignmentType === 'shared'" class="as-list">
        <div
          v-for="as in aidesAvecCharge"
          :key="as.id"
          class="as-item"
          :class="{
            'is-selected-2': selectedAS2 === as.code,
            'is-disabled': as.code === selectedAS,
            'is-overload': as.niveau === 'surcharge'
          }"
          @click="as.code !== selectedAS && (selectedAS2 = as.code)"
        >
          <input
            :id="`as2-${as.code}`"
            :checked="selectedAS2 === as.code"
            type="radio"
            :disabled="as.code === selectedAS"
            class="as-radio"
          />

          <label :for="`as2-${as.code}`" class="as-label">
            <div class="as-code">
              <ASBadge :code="as.code" />
            </div>

            <div class="as-charge">
              <ChargeBar :minutes="as.chargeMinutes" />
              <div class="as-meta">
                <span>{{ as.chargeMinutes }} min · {{ as.nbPatients }} patient(s)</span>
              </div>
            </div>

            <div class="as-niveau" :class="`niveau-${as.niveau}`">{{ as.labelNiveau }}</div>
          </label>
        </div>
      </div>

      <div class="section-label" style="margin-top: 24px;">Durée de l'activité</div>
      <div v-if="assignmentType === 'single'" class="duration-control">
        <input
          v-model.number="selectedDuree"
          type="number"
          min="5"
          max="120"
          step="5"
          class="duration-input"
          placeholder="Durée en minutes"
        />
        <span class="duration-unit">minutes</span>
      </div>

      <div v-if="assignmentType === 'shared'" class="duration-shared">
        <div class="duration-total">
          <label>Durée totale :</label>
          <div class="duration-control-shared">
            <input
              v-model.number="selectedDureeTotal"
              type="number"
              min="10"
              max="240"
              step="5"
              class="duration-input"
              placeholder="Durée totale en minutes"
            />
            <span class="duration-unit">minutes</span>
          </div>
        </div>
        <div class="duration-split">
          <div class="duration-per-as">
            <label>{{ selectedAS }} :</label>
            <div class="duration-control-shared">
              <input
                v-model.number="selectedDuree1"
                type="number"
                min="5"
                max="240"
                step="5"
                class="duration-input"
                @change="syncDurations"
                placeholder="Durée"
              />
              <span class="duration-unit">min</span>
            </div>
          </div>
          <div class="duration-per-as">
            <label>{{ selectedAS2 || '2e Aide' }} :</label>
            <div class="duration-control-shared">
              <input
                v-model.number="selectedDuree2"
                type="number"
                min="5"
                max="240"
                step="5"
                class="duration-input"
                @change="syncDurations"
                placeholder="Durée"
              />
              <span class="duration-unit">min</span>
            </div>
          </div>
          <div class="duration-sum">
            Total: <strong>{{ (selectedDuree1 || 0) + (selectedDuree2 || 0) }} min</strong>
          </div>
        </div>
      </div>

      <div class="section-label" style="margin-top: 24px;">Moment de l'activité</div>
      <div class="moment-control">
        <button
          v-for="option in momentOptions"
          :key="option.key"
          type="button"
          class="moment-btn"
          :class="{ 'is-active': selectedMoment === option.key }"
          @click="selectedMoment = option.key"
        >
          {{ option.label }}
        </button>
      </div>

      <div class="modal-footer">
        <button class="btn btn-secondary" @click="$emit('close')">Annuler</button>
        <button 
          class="btn btn-primary" 
          :disabled="!selectedAS || (assignmentType === 'shared' && (!selectedAS2 || !selectedDuree1 || !selectedDuree2))" 
          @click="handleConfirm"
        >
          {{ asActuel ? 'Modifier' : 'Confirmer' }}<span v-if="selectedAS"> {{ selectedAS }}</span><span v-if="assignmentType === 'shared' && selectedAS2"> + {{ selectedAS2 }}</span>
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
  activite: { type: String, default: 'douche' },
  dureeActuelle: { type: Number, default: 30 },
  momentActuel: { type: String, default: 'matin' },
  aidesAvecCharge: { type: Array, required: true },
  recommandation: { type: Object, default: null }
})

const emit = defineEmits(['close', 'confirm', 'remove'])
const selectedAS = ref(props.asActuel || props.recommandation?.code || null)
const selectedAS2 = ref(null)
const selectedDuree = ref(props.dureeActuelle !== undefined && props.dureeActuelle !== null ? props.dureeActuelle : '')
const selectedDureeTotal = ref(props.dureeActuelle !== undefined && props.dureeActuelle !== null ? props.dureeActuelle : '')
const selectedDuree1 = ref(props.dureeActuelle ? Math.ceil(props.dureeActuelle / 2) : 0)
const selectedDuree2 = ref(props.dureeActuelle ? Math.floor(props.dureeActuelle / 2) : 0)
const selectedMoment = ref(props.momentActuel || (props.activite === 'coucher' ? '18-19' : 'matin'))
const assignmentType = ref('single')

const jourLabel = computed(() => {
  // Calculer la date dynamiquement basée sur la semaine
  // semaine 19 = May 11 (lundi)
  // semaine 20 = May 18 (lundi)
  // semaine 21 = May 25 (lundi)
  const baseDate = new Date(2026, 4, 11) // May 11, 2026 (semaine 19, lundi)
  const weekOffset = props.semaine - 19
  const jourIndex = {
    lundi: 0,
    mardi: 1,
    mercredi: 2,
    jeudi: 3,
    vendredi: 4,
    samedi: 5,
    dimanche: 6
  }[props.jour] ?? 0
  
  const date = new Date(baseDate)
  date.setDate(baseDate.getDate() + (weekOffset * 7) + jourIndex)
  
  const jours = {
    lundi: 'Lundi',
    mardi: 'Mardi',
    mercredi: 'Mercredi',
    jeudi: 'Jeudi',
    vendredi: 'Vendredi',
    samedi: 'Samedi',
    dimanche: 'Dimanche'
  }
  const dayName = jours[props.jour] || props.jour
  const dayNumber = date.getDate()
  const months = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre']
  const monthName = months[date.getMonth()]
  
  return `${dayName} ${dayNumber} ${monthName}`
})

const activiteLabel = computed(() => {
  const labels = {
    douche: 'Douche',
    wc: 'WC',
    toilette: 'Toilette',
    coucher: 'Coucher',
    repas: 'Repas',
    lever: 'Lever',
    sieste: 'Sieste',
    petitDejeuner: 'Petit déjeuner'
  }
  return labels[props.activite] || props.activite
})

const momentOptions = computed(() => {
  // Pour l'activité "coucher", afficher les créneaux horaires 18-19h et 19-20h
  if (props.activite === 'coucher') {
    return [
      { key: '18-19', label: '🌆 18-19h' },
      { key: '19-20', label: '🌙 19-20h' }
    ]
  }
  // Pour les autres activités, afficher Matin / Soir
  return [
    { key: 'matin', label: '🌅 Matin' },
    { key: 'soir', label: '🌙 Soir' }
  ]
})

const handleConfirm = () => {
  if (!selectedAS.value) return
  
  if (assignmentType.value === 'single') {
    const duree = selectedDuree.value ? parseInt(selectedDuree.value) : null
    emit('confirm', { as: selectedAS.value, duree, moment: selectedMoment.value })
  } else {
    // Assignation à 2 aides
    if (!selectedAS2.value) return
    emit('confirm', {
      type: 'shared',
      ases: [selectedAS.value, selectedAS2.value],
      durees: [parseInt(selectedDuree1.value) || 0, parseInt(selectedDuree2.value) || 0],
      moment: selectedMoment.value
    })
  }
}

const syncDurations = () => {
  // Sync the total when individual durations change
  selectedDureeTotal.value = (selectedDuree1.value || 0) + (selectedDuree2.value || 0)
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
  font-size: 22px;
  font-weight: 700;
  color: var(--color-text-primary);
  margin-bottom: 8px;
}

.modal-subtitle {
  font-size: 15px;
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
  padding: 20px 24px 12px;
  font-size: 14px;
  font-weight: 700;
  color: var(--color-text-primary);
  text-transform: uppercase;
  letter-spacing: 0.8px;
  border-top: 2px solid var(--color-border-light);
}

.as-list {
  padding: 0 24px 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.as-item {
  border: 2px solid var(--color-border-light);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all var(--transition-base);
  background: white;
  box-shadow: var(--shadow-xs);
  position: relative;
  overflow: hidden;
}

.as-item::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(255,255,255,0.6) 0%, transparent 100%);
  opacity: 0;
  transition: opacity var(--transition-base);
  pointer-events: none;
}

.as-item:hover {
  border-color: var(--color-primary);
  background: var(--color-bg-tertiary);
  box-shadow: var(--shadow-sm);
  transform: translateY(-2px);
}

.as-item:hover::before {
  opacity: 0.5;
}

.as-item.is-selected {
  border-color: var(--color-primary);
  background: linear-gradient(135deg, var(--color-primary-light) 0%, rgba(37, 99, 235, 0.15) 100%);
  box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.25), var(--shadow-md);
  border-width: 3px;
  transform: scale(1.02);
}

.as-item.is-recommended {
  border-color: var(--color-success);
  background: linear-gradient(135deg, var(--color-success-light) 0%, rgba(16, 185, 129, 0.08) 100%);
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1), var(--shadow-sm);
}

.as-item.is-overload {
  /* Aides en surcharge restent sélectionnables */
}

.as-radio {
  position: absolute;
  opacity: 0;
  pointer-events: none;
}

.as-label {
  display: grid;
  grid-template-columns: 80px 1fr auto;
  gap: 18px;
  align-items: center;
  padding: 18px 20px;
  cursor: pointer;
  font-size: 15px;
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
  gap: 12px;
  font-size: 13px;
  color: var(--color-text-secondary);
  font-weight: 500;
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
  padding: 14px 20px;
  border-radius: var(--radius-md);
  font-size: 15px;
  font-weight: 700;
  transition: all var(--transition-base);
  cursor: pointer;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-secondary {
  background: white;
  border: 2px solid var(--color-border-light);
  color: var(--color-text-primary);
}

.btn-secondary:hover:not(:disabled) {
  border-color: var(--color-primary);
  color: var(--color-primary);
  background: var(--color-primary-light);
}

.btn-primary {
  background: linear-gradient(135deg, var(--color-primary) 0%, #1D4ED8 100%);
  color: white;
  border: 2px solid var(--color-primary);
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(37, 99, 235, 0.4);
}

.duration-control {
  display: flex;
  gap: 8px;
  align-items: center;
  padding: 0 24px 16px;
}

.duration-input {
  flex: 1;
  padding: 12px 14px;
  border: 2px solid var(--color-border-light);
  border-radius: var(--radius-md);
  font-size: 15px;
  font-weight: 600;
  transition: all var(--transition-base);
}

.duration-input:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.15);
}

.duration-unit {
  font-size: 13px;
  color: var(--color-text-secondary);
  font-weight: 500;
  white-space: nowrap;
}

.moment-control {
  display: flex;
  gap: 12px;
  padding: 0 24px 16px;
}

.moment-btn {
  flex: 1;
  padding: 14px 18px;
  border: 2px solid var(--color-border-light);
  border-radius: var(--radius-md);
  background: white;
  color: var(--color-text-primary);
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  transition: all var(--transition-base);
}

.moment-btn:hover {
  border-color: var(--color-primary);
  background: var(--color-primary-light);
  transform: translateY(-2px);
}

.moment-btn.is-active {
  background: linear-gradient(135deg, var(--color-primary) 0%, #1D4ED8 100%);
  color: white;
  border-color: var(--color-primary);
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
}

.type-control {
  display: flex;
  gap: 12px;
  padding: 0 24px 16px;
}

.type-btn {
  flex: 1;
  padding: 14px 20px;
  border: 2px solid var(--color-border-light);
  border-radius: var(--radius-md);
  background: white;
  color: var(--color-text-primary);
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  transition: all var(--transition-base);
}

.type-btn:hover {
  border-color: var(--color-primary);
  background: var(--color-primary-light);
  transform: translateY(-2px);
}

.type-btn.is-active {
  background: linear-gradient(135deg, var(--color-primary) 0%, #1D4ED8 100%);
  color: white;
  border-color: var(--color-primary);
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
}

.duration-shared {
  padding: 0 24px 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.duration-total {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.duration-total label {
  font-size: 14px;
  font-weight: 700;
  color: var(--color-text-primary);
}

.duration-split {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 12px;
  background: var(--color-bg-tertiary);
  border-radius: var(--radius-md);
}

.duration-per-as {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.duration-per-as label {
  font-size: 14px;
  font-weight: 700;
  color: var(--color-text-primary);
}

.duration-control-shared {
  display: flex;
  gap: 10px;
  align-items: center;
}

.duration-sum {
  font-size: 14px;
  color: var(--color-text-primary);
  padding-top: 12px;
  border-top: 2px solid var(--color-border-light);
  text-align: right;
  font-weight: 700;
}

.as-item.is-selected-2 {
  border-color: var(--color-warning);
  background: linear-gradient(135deg, #FEF3C7 0%, rgba(251, 191, 36, 0.15) 100%);
  box-shadow: 0 0 0 4px rgba(251, 191, 36, 0.25), var(--shadow-md);
  border-width: 3px;
  transform: scale(1.02);
}

.as-item.is-disabled {
  opacity: 0.5;
  pointer-events: none;
}
</style>

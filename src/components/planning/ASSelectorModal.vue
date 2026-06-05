<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-content">

      <!-- Header -->
      <div class="modal-header">
        <div class="modal-header-top">
          <div class="modal-context">
            <span class="context-chip">{{ activiteLabel }}</span>
            <span class="context-sep">·</span>
            <span class="context-date">{{ jourLabel }}</span>
          </div>
          <button class="close-btn" @click="$emit('close')">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
          </button>
        </div>
        <h2 class="modal-title">{{ patientNom }}</h2>

        <!-- Recommandation inline -->
        <div v-if="recommandation && !isCurrentAssigned" class="reco-inline">
          <span class="reco-icon">✨</span>
          <span><strong>{{ recommandation.code }}</strong> est le moins chargé ({{ recommandation.chargeMinutes }} min)</span>
        </div>

        <!-- Assignation actuelle -->
        <div v-if="isCurrentAssigned" class="current-inline">
          <span>Assigné : <strong>{{ currentAssignmentLabel }}</strong></span>
          <button class="btn-remove" @click="handleRemove">Retirer</button>
        </div>
      </div>

      <div class="modal-body">

        <!-- Type toggle -->
        <div class="field-group">
          <label class="field-label">Type</label>
          <div class="segmented">
            <button
              type="button"
              class="seg-btn"
              :class="{ 'is-active': assignmentType === 'single' }"
              @click="assignmentType = 'single'; selectedAS2 = null"
            >👤 1 Aide</button>
            <button
              type="button"
              class="seg-btn"
              :class="{ 'is-active': assignmentType === 'shared' }"
              @click="assignmentType = 'shared'"
            >👥 2 Aides</button>
          </div>
        </div>

        <!-- AS Selection -->
        <div class="field-group">
          <label class="field-label">{{ assignmentType === 'shared' ? '1er Aide-Soignant' : 'Aide-Soignant' }}</label>
          <div class="as-grid">
            <div
              v-for="as in aidesAvecCharge"
              :key="as.id"
              class="as-card"
              :class="{
                'is-selected': selectedAS === as.code,
                'is-recommended': recommandation?.code === as.code && !isCurrentAssigned,
              }"
              @click="selectedAS = as.code"
            >
              <div class="as-card-top">
                <ASBadge :code="as.code" />
                <span class="as-niveau-chip" :class="`niveau-${as.niveau}`">{{ as.labelNiveau }}</span>
                <span v-if="recommandation?.code === as.code && !isCurrentAssigned" class="reco-star">✨</span>
              </div>
              <ChargeBar :minutes="as.chargeMinutes" />
              <div class="as-card-meta">{{ as.chargeMinutes }} min</div>
            </div>
          </div>
        </div>

        <!-- 2ème AS -->
        <div v-if="assignmentType === 'shared'" class="field-group">
          <label class="field-label">2ème Aide-Soignant</label>
          <div class="as-grid">
            <div
              v-for="as in aidesAvecCharge"
              :key="as.id"
              class="as-card"
              :class="{
                'is-selected-2': selectedAS2 === as.code,
                'is-disabled': as.code === selectedAS,
              }"
              @click="as.code !== selectedAS && (selectedAS2 = as.code)"
            >
              <div class="as-card-top">
                <ASBadge :code="as.code" />
                <span class="as-niveau-chip" :class="`niveau-${as.niveau}`">{{ as.labelNiveau }}</span>
              </div>
              <ChargeBar :minutes="as.chargeMinutes" />
              <div class="as-card-meta">{{ as.chargeMinutes }} min</div>
            </div>
          </div>
        </div>

        <!-- Durée (single) -->
        <div v-if="assignmentType === 'single'" class="field-group field-row">
          <label class="field-label">Durée</label>
          <div class="stepper">
            <button type="button" class="step-btn" @click="selectedDuree = Math.max(5, (selectedDuree || 30) - 5)">−</button>
            <span class="step-val">{{ selectedDuree || 30 }} min</span>
            <button type="button" class="step-btn" @click="selectedDuree = Math.min(120, (selectedDuree || 30) + 5)">+</button>
          </div>
        </div>

        <!-- Durée (shared) -->
        <div v-if="assignmentType === 'shared'" class="field-group">
          <label class="field-label">Durées</label>
          <div class="shared-durations">
            <div class="shared-dur-row">
              <span class="shared-dur-label">{{ selectedAS || '1er AS' }}</span>
              <div class="stepper stepper-sm">
                <button type="button" class="step-btn" @click="selectedDuree1 = Math.max(5, (selectedDuree1 || 15) - 5); syncDurations()">−</button>
                <span class="step-val">{{ selectedDuree1 || 15 }} min</span>
                <button type="button" class="step-btn" @click="selectedDuree1 = Math.min(120, (selectedDuree1 || 15) + 5); syncDurations()">+</button>
              </div>
            </div>
            <div class="shared-dur-row">
              <span class="shared-dur-label">{{ selectedAS2 || '2e AS' }}</span>
              <div class="stepper stepper-sm">
                <button type="button" class="step-btn" @click="selectedDuree2 = Math.max(5, (selectedDuree2 || 15) - 5); syncDurations()">−</button>
                <span class="step-val">{{ selectedDuree2 || 15 }} min</span>
                <button type="button" class="step-btn" @click="selectedDuree2 = Math.min(120, (selectedDuree2 || 15) + 5); syncDurations()">+</button>
              </div>
            </div>
            <div class="shared-total">Total : <strong>{{ (selectedDuree1 || 0) + (selectedDuree2 || 0) }} min</strong></div>
          </div>
        </div>

        <!-- Moment -->
        <div class="field-group field-row">
          <label class="field-label">Moment</label>
          <div class="segmented">
            <button
              v-for="option in momentOptions"
              :key="option.key"
              type="button"
              class="seg-btn"
              :class="{ 'is-active': selectedMoment === option.key }"
              @click="selectedMoment = option.key"
            >{{ option.label }}</button>
          </div>
        </div>

        <!-- Commentaire -->
        <div class="field-group">
          <label class="field-label">Commentaire (optionnel)</label>
          <textarea
            v-model="notesSoignant"
            class="comment-textarea"
            placeholder="Ex : patient agité, douche assise, aide partielle..."
            rows="3"
          ></textarea>
        </div>

        <!-- Répéter sur d'autres jours -->
        <div class="field-group">
          <div class="repeat-header">
            <label class="field-label">Répéter sur d'autres jours</label>
            <button type="button" class="btn-semaine" @click="toggleSemaine">
              {{ joursCopie.length === otherDays.length ? 'Tout décocher' : 'Toute la semaine' }}
            </button>
          </div>
          <div class="days-grid">
            <button
              v-for="day in allDaysOrdered"
              :key="day.key"
              type="button"
              class="day-btn"
              :class="{
                'is-current': day.key === jour,
                'is-active': joursCopie.includes(day.key)
              }"
              :disabled="day.key === jour"
              @click="toggleJour(day.key)"
            >{{ day.label }}</button>
          </div>
        </div>

        <!-- Répéter sur d'autres semaines -->
        <div class="field-group">
          <label class="field-label">Répéter sur d'autres semaines</label>
          <div class="weeks-repeat">

            <div class="weeks-row">
              <span class="weeks-label">🔮 Semaines suivantes</span>
              <div class="weeks-quick">
                <button type="button" v-for="n in [1,2,4,8,12]" :key="n"
                  class="week-quick-btn"
                  :class="{ 'is-active': nbSemainesApres === n }"
                  @click="nbSemainesApres = nbSemainesApres === n ? 0 : n"
                >{{ n }}</button>
              </div>
              <div class="stepper stepper-sm">
                <button type="button" class="step-btn" @click="nbSemainesApres = Math.max(0, nbSemainesApres - 1)">−</button>
                <span class="step-val">{{ nbSemainesApres }} sem</span>
                <button type="button" class="step-btn" @click="nbSemainesApres = Math.min(52, nbSemainesApres + 1)">+</button>
              </div>
            </div>

            <div v-if="nbSemainesApres > 0" class="weeks-summary">
              Ce soin sera créé sur
              <strong>{{ nbSemainesApres + 1 }} semaine(s)</strong>
              au total (semaine actuelle incluse)
              <span v-if="joursCopie.length > 0"> × {{ joursCopie.length + 1 }} jour(s)</span>
            </div>
          </div>
        </div>

      </div>

      <!-- Footer -->
      <div class="modal-footer">
        <button class="btn-cancel" @click="$emit('close')">Annuler</button>
        <button
          class="btn-confirm"
          :disabled="!selectedAS || (assignmentType === 'shared' && (!selectedAS2 || !selectedDuree1 || !selectedDuree2))"
          @click="handleConfirm"
        >
          {{ isCurrentAssigned ? 'Modifier' : 'Confirmer' }}
          <span v-if="selectedAS" class="confirm-as">{{ selectedAS }}<span v-if="assignmentType === 'shared' && selectedAS2"> + {{ selectedAS2 }}</span></span>
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
  semaine: { type: String, default: '' },
  activite: { type: String, default: 'douche' },
  activityActuelle: { type: Object, default: null },
  aidesAvecCharge: { type: Array, required: true },
  recommandation: { type: Object, default: null }
})

const emit = defineEmits(['close', 'confirm', 'remove'])

const isCurrentAssigned = computed(() =>
  !!(props.activityActuelle?.as || props.activityActuelle?.type === 'shared')
)

const currentAssignmentLabel = computed(() => {
  if (props.activityActuelle?.type === 'shared') return props.activityActuelle.ases.join(' + ')
  return props.activityActuelle?.as || null
})

const isSharedCurrent = computed(() => props.activityActuelle?.type === 'shared')

const assignmentType = ref(isSharedCurrent.value ? 'shared' : 'single')
const selectedAS = ref(
  props.activityActuelle?.ases?.[0] ||
  props.activityActuelle?.as ||
  props.recommandation?.code ||
  null
)
const selectedAS2 = ref(props.activityActuelle?.ases?.[1] || null)
const selectedDuree = ref(props.activityActuelle?.duree ?? 30)
const selectedDureeTotal = ref(props.activityActuelle?.duree ?? 30)
const selectedDuree1 = ref(props.activityActuelle?.durees?.[0] ?? 15)
const selectedDuree2 = ref(props.activityActuelle?.durees?.[1] ?? 15)
const selectedMoment = ref(props.activityActuelle?.moment || (props.activite === 'coucher' ? '18-19' : 'matin'))
const notesSoignant = ref(props.activityActuelle?.notesSoignant || '')
const joursCopie = ref([])
const nbSemainesApres = ref(0)

const allDaysOrdered = [
  { key: 'lundi',    label: 'Lun' },
  { key: 'mardi',    label: 'Mar' },
  { key: 'mercredi', label: 'Mer' },
  { key: 'jeudi',    label: 'Jeu' },
  { key: 'vendredi', label: 'Ven' },
  { key: 'samedi',   label: 'Sam' },
  { key: 'dimanche', label: 'Dim' },
]

const otherDays = computed(() => allDaysOrdered.filter(d => d.key !== props.jour))

const toggleJour = (key) => {
  const idx = joursCopie.value.indexOf(key)
  if (idx >= 0) joursCopie.value.splice(idx, 1)
  else joursCopie.value.push(key)
}

const toggleSemaine = () => {
  if (joursCopie.value.length === otherDays.value.length) {
    joursCopie.value = []
  } else {
    joursCopie.value = otherDays.value.map(d => d.key)
  }
}

const jourLabel = computed(() => {
  const jourIndex = { lundi: 0, mardi: 1, mercredi: 2, jeudi: 3, vendredi: 4, samedi: 5, dimanche: 6 }[props.jour] ?? 0
  const jourNames = { lundi: 'Lundi', mardi: 'Mardi', mercredi: 'Mercredi', jeudi: 'Jeudi', vendredi: 'Vendredi', samedi: 'Samedi', dimanche: 'Dimanche' }
  const dayName = jourNames[props.jour] || props.jour

  if (!props.semaine) return dayName

  const [y, m, d] = props.semaine.split('-').map(Number)
  const date = new Date(y, m - 1, d + jourIndex)
  const months = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre']
  return `${dayName} ${date.getDate()} ${months[date.getMonth()]}`
})

const activiteLabel = computed(() => {
  const labels = {
    douche: 'Douche',
    wc: 'WC',
    toilette: 'Toilette',
    coucher: 'Coucher',
    repas: 'Repas',
    lever: 'Lever sieste',
    sieste: 'Mise Sieste',
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
  
  const note = notesSoignant.value?.trim() || null
  const copie = [...joursCopie.value]
  const semaines = { apres: nbSemainesApres.value }
  if (assignmentType.value === 'single') {
    const duree = selectedDuree.value ? parseInt(selectedDuree.value) : 30
    emit('confirm', { as: selectedAS.value, duree, moment: selectedMoment.value, notesSoignant: note, joursCopie: copie, semaines })
  } else {
    if (!selectedAS2.value) return
    emit('confirm', {
      type: 'shared',
      ases: [selectedAS.value, selectedAS2.value],
      durees: [parseInt(selectedDuree1.value) || 0, parseInt(selectedDuree2.value) || 0],
      moment: selectedMoment.value,
      notesSoignant: note,
      joursCopie: copie,
      semaines
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
/* ── Overlay ─────────────────────────────────── */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.45);
  backdrop-filter: blur(6px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: overlayIn 0.2s ease;
}

@keyframes overlayIn {
  from { opacity: 0; }
  to   { opacity: 1; }
}

/* ── Modal shell ─────────────────────────────── */
.modal-content {
  background: white;
  border-radius: 16px;
  width: 500px;
  max-width: calc(100vw - 24px);
  max-height: 92vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: 0 24px 48px rgba(0, 0, 0, 0.18), 0 4px 12px rgba(0, 0, 0, 0.08);
  animation: modalIn 0.22s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes modalIn {
  from { transform: translateY(16px) scale(0.97); opacity: 0; }
  to   { transform: translateY(0) scale(1); opacity: 1; }
}

/* ── Header ──────────────────────────────────── */
.modal-header {
  padding: 20px 20px 16px;
  background: linear-gradient(135deg, #F8FAFF 0%, #EEF2FF 100%);
  border-bottom: 1px solid #E8EEFF;
  flex-shrink: 0;
}

.modal-header-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}

.modal-context {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: var(--color-text-secondary);
}

.context-chip {
  background: var(--color-primary);
  color: white;
  font-size: 11px;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: 20px;
  letter-spacing: 0.3px;
}

.context-sep {
  color: var(--color-text-tertiary);
}

.context-date {
  font-weight: 500;
}

.close-btn {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  color: var(--color-text-tertiary);
  transition: all 0.15s;
  background: transparent;
  cursor: pointer;
}

.close-btn:hover {
  background: rgba(0, 0, 0, 0.07);
  color: var(--color-text-primary);
}

.modal-title {
  font-size: 18px;
  font-weight: 700;
  color: var(--color-text-primary);
  margin: 0;
}

.reco-inline {
  margin-top: 8px;
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: var(--color-success-dark);
  background: #D1FAE5;
  padding: 5px 10px;
  border-radius: 8px;
}

.reco-icon { font-size: 13px; }

.current-inline {
  margin-top: 8px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 12px;
  color: var(--color-primary);
  background: var(--color-primary-light);
  padding: 5px 10px;
  border-radius: 8px;
}

.btn-remove {
  font-size: 11px;
  font-weight: 700;
  color: var(--color-danger);
  padding: 2px 8px;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.15s;
}

.btn-remove:hover { background: var(--color-danger-light); }

/* ── Body ────────────────────────────────────── */
.modal-body {
  padding: 16px 20px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 16px;
  flex: 1;
}

/* ── Field group ─────────────────────────────── */
.field-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.field-group.field-row {
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
}

.field-label {
  font-size: 11px;
  font-weight: 700;
  color: var(--color-text-tertiary);
  text-transform: uppercase;
  letter-spacing: 0.6px;
}

/* ── Segmented control ───────────────────────── */
.segmented {
  display: flex;
  background: var(--color-bg-secondary);
  border-radius: 10px;
  padding: 3px;
  gap: 3px;
}

.seg-btn {
  flex: 1;
  padding: 7px 12px;
  border-radius: 7px;
  font-size: 13px;
  font-weight: 600;
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: all 0.18s;
  background: transparent;
}

.seg-btn:hover:not(.is-active) {
  background: rgba(255, 255, 255, 0.7);
  color: var(--color-text-primary);
}

.seg-btn.is-active {
  background: white;
  color: var(--color-primary);
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.12);
}

/* ── AS card grid ────────────────────────────── */
.as-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 8px;
}

.as-card {
  padding: 10px;
  border: 1.5px solid var(--color-border-light);
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.18s;
  background: white;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.as-card:hover {
  border-color: var(--color-primary);
  background: #F8FAFF;
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(37, 99, 235, 0.1);
}

.as-card.is-selected {
  border-color: var(--color-primary);
  background: #EEF2FF;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.2);
}

.as-card.is-selected-2 {
  border-color: var(--color-warning);
  background: #FFFBEB;
  box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.2);
}

.as-card.is-recommended {
  border-color: var(--color-success);
  background: #F0FDF4;
}

.as-card.is-disabled {
  opacity: 0.4;
  pointer-events: none;
}

.as-card-top {
  display: flex;
  align-items: center;
  gap: 5px;
  flex-wrap: wrap;
}

.reco-star {
  font-size: 12px;
  margin-left: auto;
}

.as-card-meta {
  font-size: 10px;
  font-weight: 600;
  color: var(--color-text-secondary);
  text-align: right;
}

/* ── Niveau chip ─────────────────────────────── */
.as-niveau-chip {
  font-size: 9px;
  font-weight: 700;
  padding: 2px 6px;
  border-radius: 20px;
  white-space: nowrap;
  text-transform: uppercase;
  letter-spacing: 0.3px;
}

.niveau-leger  { background: var(--color-success-light); color: var(--color-success-dark); }
.niveau-normal { background: #FEF3C7; color: #854D0E; }
.niveau-eleve  { background: var(--color-warning-light); color: var(--color-warning-dark); }
.niveau-surcharge { background: var(--color-danger-light); color: var(--color-danger-dark); }

/* ── Stepper ─────────────────────────────────── */
.stepper {
  display: flex;
  align-items: center;
  gap: 0;
  border: 1.5px solid var(--color-border-light);
  border-radius: 10px;
  overflow: hidden;
  background: white;
}

.step-btn {
  width: 34px;
  height: 34px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-weight: 400;
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: background 0.15s, color 0.15s;
  background: transparent;
  line-height: 1;
}

.step-btn:hover {
  background: var(--color-bg-secondary);
  color: var(--color-primary);
}

.step-val {
  min-width: 64px;
  text-align: center;
  font-size: 13px;
  font-weight: 700;
  color: var(--color-text-primary);
  border-left: 1.5px solid var(--color-border-light);
  border-right: 1.5px solid var(--color-border-light);
  padding: 0 4px;
  line-height: 34px;
}

.stepper-sm .step-btn { width: 28px; height: 28px; font-size: 16px; }
.stepper-sm .step-val { min-width: 56px; line-height: 28px; font-size: 12px; }

/* ── Shared durations ────────────────────────── */
.shared-durations {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 12px;
  background: var(--color-bg-tertiary);
  border-radius: 10px;
  border: 1px solid var(--color-border-light);
}

.shared-dur-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.shared-dur-label {
  font-size: 12px;
  font-weight: 700;
  color: var(--color-text-primary);
  min-width: 48px;
}

.shared-total {
  font-size: 12px;
  color: var(--color-text-secondary);
  text-align: right;
  padding-top: 6px;
  border-top: 1px solid var(--color-border-light);
}

/* ── Repeat days ─────────────────────────────── */
.repeat-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.btn-semaine {
  font-size: 10px;
  font-weight: 600;
  color: var(--color-primary);
  background: var(--color-primary-light);
  border: 1px solid rgba(37,99,235,0.2);
  border-radius: 6px;
  padding: 3px 8px;
  cursor: pointer;
  transition: all 0.15s;
}
.btn-semaine:hover { background: #DBEAFE; }

.days-grid {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.day-btn {
  width: 38px;
  height: 34px;
  border-radius: 8px;
  font-size: 11px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.15s;
  border: 1.5px solid var(--color-border-light);
  background: white;
  color: var(--color-text-secondary);
}

.day-btn:hover:not(:disabled) {
  border-color: var(--color-primary);
  color: var(--color-primary);
  background: #EFF6FF;
}

.day-btn.is-active {
  background: var(--color-primary);
  border-color: var(--color-primary);
  color: white;
  box-shadow: 0 2px 6px rgba(37,99,235,0.3);
}

.day-btn.is-current {
  background: #F1F5F9;
  border-color: #CBD5E1;
  color: #94A3B8;
  cursor: default;
  font-style: italic;
}

/* ── Weeks repeat ───────────────────────────── */
.weeks-repeat {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 12px;
  background: var(--color-bg-secondary);
  border-radius: 10px;
  border: 1px solid var(--color-border-light);
}

.weeks-row {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.weeks-label {
  font-size: 12px;
  font-weight: 600;
  color: var(--color-text-secondary);
  min-width: 160px;
}

.weeks-quick {
  display: flex;
  gap: 4px;
}

.week-quick-btn {
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.15s;
  border: 1.5px solid var(--color-border-light);
  background: white;
  color: var(--color-text-secondary);
}

.week-quick-btn:hover { border-color: var(--color-primary); color: var(--color-primary); }
.week-quick-btn.is-active { background: var(--color-primary); border-color: var(--color-primary); color: white; }

.weeks-summary {
  font-size: 11px;
  color: var(--color-primary);
  background: var(--color-primary-light);
  padding: 5px 10px;
  border-radius: 6px;
  border: 1px solid rgba(37,99,235,0.2);
}

/* ── Comment textarea ───────────────────────── */
.comment-textarea {
  width: 100%;
  padding: 10px 12px;
  border: 1.5px solid var(--color-border-light);
  border-radius: 10px;
  font-size: 13px;
  font-family: inherit;
  color: var(--color-text-primary);
  resize: vertical;
  min-height: 70px;
  transition: border-color 0.18s;
  box-sizing: border-box;
}
.comment-textarea:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}
.comment-textarea::placeholder { color: var(--color-text-tertiary); }

/* ── Footer ──────────────────────────────────── */
.modal-footer {
  display: flex;
  gap: 8px;
  padding: 12px 20px 16px;
  border-top: 1px solid var(--color-border-light);
  background: var(--color-bg-tertiary);
  flex-shrink: 0;
}

.btn-cancel {
  flex: 0 0 auto;
  padding: 10px 16px;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 600;
  color: var(--color-text-secondary);
  background: white;
  border: 1.5px solid var(--color-border-light);
  cursor: pointer;
  transition: all 0.15s;
}

.btn-cancel:hover {
  border-color: #CBD5E1;
  color: var(--color-text-primary);
}

.btn-confirm {
  flex: 1;
  padding: 10px 16px;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 700;
  color: white;
  background: var(--color-primary);
  border: none;
  cursor: pointer;
  transition: all 0.18s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  box-shadow: 0 2px 8px rgba(37, 99, 235, 0.3);
}

.btn-confirm:hover:not(:disabled) {
  background: var(--color-primary-dark);
  box-shadow: 0 4px 14px rgba(37, 99, 235, 0.4);
  transform: translateY(-1px);
}

.btn-confirm:disabled {
  opacity: 0.45;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.confirm-as {
  background: rgba(255, 255, 255, 0.25);
  padding: 2px 8px;
  border-radius: 20px;
  font-size: 12px;
}
</style>

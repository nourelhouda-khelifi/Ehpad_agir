<template>
  <div v-if="isOpen" class="modal-overlay" @click.self="closeModal">
    <div class="modal-content">

      <!-- Header -->
      <div class="modal-header">
        <div class="header-left">
          <div class="header-icon">{{ isEditMode ? '✏️' : '👤' }}</div>
          <div>
            <h2 class="modal-title">{{ isEditMode ? 'Modifier le patient' : 'Nouveau patient' }}</h2>
            <p class="modal-subtitle">{{ isEditMode ? `${patient.nom} ${patient.prenom}` : 'Remplissez les informations du résident' }}</p>
          </div>
        </div>
        <button class="close-btn" @click="closeModal">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
        </button>
      </div>

      <!-- Error -->
      <div v-if="errorMessage" class="error-banner">
        <span>⚠️</span> {{ errorMessage }}
      </div>

      <!-- Form -->
      <form @submit.prevent="submitForm" class="patient-form">

        <!-- Section Identité -->
        <div class="form-section">
          <div class="section-label">
            <span class="section-icon">🏠</span> Identité
          </div>
          <div class="form-row cols-3">
            <div class="form-group">
              <label>Chambre <span class="required">*</span></label>
              <input v-model="formData.numeroChambre" type="text" placeholder="ex: 101" required />
            </div>
            <div class="form-group">
              <label>Nom <span class="required">*</span></label>
              <input v-model="formData.nom" type="text" placeholder="ex: Dupont" required />
            </div>
            <div class="form-group">
              <label>Prénom <span class="required">*</span></label>
              <input v-model="formData.prenom" type="text" placeholder="ex: Marie" required />
            </div>
          </div>
          <div class="form-row cols-2">
            <div class="form-group">
              <label>Étage</label>
              <input v-model.number="formData.etage" type="number" min="0" max="5" placeholder="1" />
            </div>
            <div class="form-group">
              <label>Statut</label>
              <select v-model="formData.statut">
                <option value="">— Non défini</option>
                <option value="HOSPITALISE">🏥 Hospitalisé</option>
                <option value="AMBULATOIRE">🚶 Ambulatoire</option>
                <option value="CONGE">🏡 En congé</option>
                <option value="DECES">⚠️ Décès</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Section Classification -->
        <div class="form-section">
          <div class="section-label">
            <span class="section-icon">🏷️</span> Classification
          </div>
          <div class="form-row cols-2">
            <div class="form-group">
              <label>Catégorie</label>
              <select v-model="formData.categorie">
                <option value="">— Non défini</option>
                <option value="CAT1">🚶 Catégorie 1</option>
                <option value="CAT2">🤝 Catégorie 2</option>
                <option value="CAT3">🧠 Catégorie 3</option>
                <option value="CAT4">⚠️ Catégorie 4</option>
              </select>
            </div>
            <div class="form-group">
              <label>Profil</label>
              <select v-model="formData.profil">
                <option value="">— Non défini</option>
                <option v-for="p in profilListe" :key="p.id" :value="p.id">
                  P{{ p.numero }} – {{ p.label }}
                </option>
              </select>
            </div>
          </div>
        </div>

        <!-- Section Coucher -->
        <div class="form-section">
          <div class="section-label">
            <span class="section-icon">🌙</span> Groupe Coucher
          </div>
          <div class="coucher-options">
            <label
              v-for="opt in coucherOptions"
              :key="opt.value"
              class="coucher-option"
              :class="{ 'is-selected': formData.groupeCoucher === opt.value }"
            >
              <input type="radio" v-model="formData.groupeCoucher" :value="opt.value" class="sr-only" />
              <span class="option-icon">{{ opt.icon }}</span>
              <div>
                <div class="option-label">{{ opt.label }}</div>
                <div class="option-time">{{ opt.time }}</div>
              </div>
            </label>
          </div>
        </div>

        <!-- Section Temps de soins -->
        <div class="form-section">
          <div class="section-label">
            <span class="section-icon">⏱️</span> Temps de soins (minutes)
          </div>
          <div class="form-row cols-3">
            <div class="form-group">
              <label>Toilette lit</label>
              <input v-model.number="formData.tempsToiletteLit" type="number" min="0" />
            </div>
            <div class="form-group">
              <label>Toilette vasque</label>
              <input v-model.number="formData.tempsToiletteVasque" type="number" min="0" />
            </div>
            <div class="form-group">
              <label>Toilette moyen</label>
              <input v-model.number="formData.tempsToiletteMoyen" type="number" min="0" />
            </div>
            <div class="form-group">
              <label>WC moyen</label>
              <input v-model.number="formData.tempsWcMoyen" type="number" min="0" />
            </div>
            <div class="form-group">
              <label>Coucher moyen</label>
              <input v-model.number="formData.tempsCoucherMoyen" type="number" min="0" />
            </div>
          </div>
        </div>

        <!-- Section Options -->
        <div class="form-section">
          <div class="section-label">
            <span class="section-icon">⚙️</span> Options
          </div>
          <div class="checkboxes-row">
            <label class="checkbox-card" :class="{ 'is-checked': formData.aideSoignant }">
              <input type="checkbox" v-model="formData.aideSoignant" class="sr-only" />
              <span class="checkbox-icon">{{ formData.aideSoignant ? '✅' : '⬜' }}</span>
              <span>Aide soignant</span>
            </label>
            <label class="checkbox-card" :class="{ 'is-checked': formData.petitDejeunerAide }">
              <input type="checkbox" v-model="formData.petitDejeunerAide" class="sr-only" />
              <span class="checkbox-icon">{{ formData.petitDejeunerAide ? '✅' : '⬜' }}</span>
              <span>Petit-déj aidé</span>
            </label>
            <label class="checkbox-card" :class="{ 'is-checked': formData.sansDouche }">
              <input type="checkbox" v-model="formData.sansDouche" class="sr-only" />
              <span class="checkbox-icon">{{ formData.sansDouche ? '✅' : '⬜' }}</span>
              <span>Sans douche</span>
            </label>
          </div>
        </div>

        <!-- Footer -->
        <div class="modal-footer">
          <button type="button" class="btn-cancel" @click="closeModal">Annuler</button>
          <button type="submit" class="btn-submit" :disabled="isSubmitting">
            <span v-if="isSubmitting">{{ isEditMode ? 'Modification...' : 'Création...' }}</span>
            <span v-else>{{ isEditMode ? '✓ Enregistrer les modifications' : '+ Créer le patient' }}</span>
          </button>
        </div>

      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { PATIENT_PROFILS, COUCHER_OPTIONS } from '@/constants/patientConfig.js'
import apiClient from '@/api/client.js'

const props = defineProps({
  isOpen: { type: Boolean, required: true },
  patient: { type: Object, default: null }
})

const emit = defineEmits(['close', 'patient-created', 'patient-updated'])

const isSubmitting = ref(false)
const errorMessage = ref('')

const isEditMode = computed(() => !!props.patient)

const profilListe = computed(() =>
  Object.values(PATIENT_PROFILS).sort((a, b) => a.numero - b.numero)
)

const coucherOptions = COUCHER_OPTIONS

const emptyForm = () => ({
  numeroChambre: '',
  nom: '',
  prenom: '',
  etage: null,
  statut: '',
  categorie: '',
  profil: '',
  tempsToiletteLit: 30,
  tempsToiletteVasque: 30,
  tempsToiletteMoyen: 30,
  tempsWcMoyen: 30,
  tempsCoucherMoyen: 30,
  aideSoignant: false,
  petitDejeunerAide: false,
  sansDouche: false,
  groupeCoucher: 'NON_DEFINI'
})

const formData = ref(emptyForm())

// Pré-remplir quand on ouvre en mode édition
watch(() => props.isOpen, (open) => {
  if (open && props.patient) {
    formData.value = {
      numeroChambre: props.patient.numeroChambre || '',
      nom: props.patient.nom || '',
      prenom: props.patient.prenom || '',
      etage: props.patient.etage ?? null,
      statut: props.patient.statut || '',
      categorie: props.patient.categorie || '',
      profil: props.patient.profil || '',
      tempsToiletteLit: props.patient.tempsToiletteLit ?? 30,
      tempsToiletteVasque: props.patient.tempsToiletteVasque ?? 30,
      tempsToiletteMoyen: props.patient.tempsToiletteMoyen ?? 30,
      tempsWcMoyen: props.patient.tempsWcMoyen ?? 30,
      tempsCoucherMoyen: props.patient.tempsCoucherMoyen ?? 30,
      aideSoignant: props.patient.aideSoignant ?? false,
      petitDejeunerAide: props.patient.petitDejeunerAide ?? false,
      sansDouche: props.patient.sansDouche ?? false,
      groupeCoucher: props.patient.groupeCoucher || 'NON_DEFINI'
    }
  } else if (open && !props.patient) {
    formData.value = emptyForm()
  }
  errorMessage.value = ''
})

const closeModal = () => {
  formData.value = emptyForm()
  errorMessage.value = ''
  emit('close')
}

const submitForm = async () => {
  errorMessage.value = ''
  isSubmitting.value = true

  const payload = {
    numeroChambre: formData.value.numeroChambre || undefined,
    nom: formData.value.nom,
    prenom: formData.value.prenom,
    etage: formData.value.etage ?? undefined,
    statut: formData.value.statut || undefined,
    categorie: formData.value.categorie || undefined,
    profil: formData.value.profil || undefined,
    tempsToiletteLit: formData.value.tempsToiletteLit || undefined,
    tempsToiletteVasque: formData.value.tempsToiletteVasque || undefined,
    tempsToiletteMoyen: formData.value.tempsToiletteMoyen || undefined,
    tempsWcMoyen: formData.value.tempsWcMoyen || undefined,
    tempsCoucherMoyen: formData.value.tempsCoucherMoyen || undefined,
    aideSoignant: formData.value.aideSoignant,
    petitDejeunerAide: formData.value.petitDejeunerAide,
    sansDouche: formData.value.sansDouche,
    groupeCoucher: formData.value.groupeCoucher || 'NON_DEFINI'
  }

  try {
    if (isEditMode.value) {
      const updated = await apiClient.put(`/patients/${props.patient.id}`, payload)
      emit('patient-updated', updated)
    } else {
      const created = await apiClient.post('/patients', payload)
      emit('patient-created', created)
    }
    closeModal()
  } catch (err) {
    errorMessage.value = err.message || 'Une erreur est survenue'
  } finally {
    isSubmitting.value = false
  }
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
  animation: overlayIn 0.2s ease;
  padding: 16px;
}

@keyframes overlayIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.modal-content {
  background: white;
  border-radius: 16px;
  width: 720px;
  max-width: 100%;
  max-height: 92vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0 24px 48px rgba(0,0,0,0.18);
  animation: modalIn 0.22s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes modalIn {
  from { transform: translateY(20px) scale(0.97); opacity: 0; }
  to { transform: translateY(0) scale(1); opacity: 1; }
}

/* Header */
.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  background: linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%);
  flex-shrink: 0;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 14px;
}

.header-icon {
  width: 44px;
  height: 44px;
  background: rgba(255,255,255,0.2);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
}

.modal-title {
  font-size: 18px;
  font-weight: 700;
  color: white;
  margin: 0 0 3px;
}

.modal-subtitle {
  font-size: 13px;
  color: rgba(255,255,255,0.75);
  margin: 0;
}

.close-btn {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  color: rgba(255,255,255,0.8);
  background: rgba(255,255,255,0.1);
  cursor: pointer;
  transition: all 0.15s;
  border: none;
}

.close-btn:hover {
  background: rgba(255,255,255,0.25);
  color: white;
}

/* Error */
.error-banner {
  padding: 12px 24px;
  background: #FEE2E2;
  color: #DC2626;
  font-size: 13px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 8px;
  border-bottom: 1px solid #FECACA;
  flex-shrink: 0;
}

/* Form */
.patient-form {
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  flex: 1;
}

/* Sections */
.form-section {
  padding: 20px 24px;
  border-bottom: 1px solid #F1F5F9;
}

.form-section:last-child {
  border-bottom: none;
}

.section-label {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  color: #64748B;
  margin-bottom: 14px;
}

.section-icon {
  font-size: 14px;
}

/* Grid rows */
.form-row {
  display: grid;
  gap: 12px;
}

.cols-2 { grid-template-columns: repeat(2, 1fr); }
.cols-3 { grid-template-columns: repeat(3, 1fr); }

.form-group {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.form-group label {
  font-size: 12px;
  font-weight: 600;
  color: #374151;
}

.required {
  color: #EF4444;
}

.form-group input,
.form-group select {
  padding: 9px 12px;
  border: 1.5px solid #E2E8F0;
  border-radius: 8px;
  font-size: 13px;
  font-family: inherit;
  color: #1E293B;
  background: white;
  transition: all 0.15s;
  outline: none;
}

.form-group input:focus,
.form-group select:focus {
  border-color: #2563EB;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
  background: #F8FAFF;
}

.form-group input::placeholder {
  color: #CBD5E1;
}

/* Coucher options */
.coucher-options {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.coucher-option {
  flex: 1;
  min-width: 140px;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  border: 1.5px solid #E2E8F0;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.15s;
  background: white;
}

.coucher-option:hover {
  border-color: #2563EB;
  background: #F8FAFF;
}

.coucher-option.is-selected {
  border-color: #2563EB;
  background: #EFF6FF;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.12);
}

.option-icon {
  font-size: 18px;
  flex-shrink: 0;
}

.option-label {
  font-size: 13px;
  font-weight: 600;
  color: #1E293B;
}

.option-time {
  font-size: 11px;
  color: #64748B;
  margin-top: 1px;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0,0,0,0);
}

/* Checkboxes */
.checkboxes-row {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.checkbox-card {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 9px 14px;
  border: 1.5px solid #E2E8F0;
  border-radius: 8px;
  cursor: pointer;
  font-size: 13px;
  font-weight: 500;
  color: #374151;
  transition: all 0.15s;
  background: white;
  user-select: none;
}

.checkbox-card:hover {
  border-color: #93C5FD;
  background: #F8FAFF;
}

.checkbox-card.is-checked {
  border-color: #2563EB;
  background: #EFF6FF;
  color: #1D4ED8;
}

.checkbox-icon {
  font-size: 15px;
}

/* Footer */
.modal-footer {
  display: flex;
  gap: 10px;
  padding: 16px 24px;
  border-top: 1px solid #E2E8F0;
  background: #F8FAFC;
  flex-shrink: 0;
}

.btn-cancel {
  padding: 10px 18px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  color: #64748B;
  background: white;
  border: 1.5px solid #E2E8F0;
  cursor: pointer;
  transition: all 0.15s;
}

.btn-cancel:hover {
  border-color: #CBD5E1;
  color: #1E293B;
}

.btn-submit {
  flex: 1;
  padding: 10px 20px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 700;
  color: white;
  background: #2563EB;
  border: none;
  cursor: pointer;
  transition: all 0.15s;
  box-shadow: 0 2px 8px rgba(37, 99, 235, 0.3);
}

.btn-submit:hover:not(:disabled) {
  background: #1D4ED8;
  box-shadow: 0 4px 14px rgba(37, 99, 235, 0.4);
}

.btn-submit:disabled {
  opacity: 0.55;
  cursor: not-allowed;
  box-shadow: none;
}

@media (max-width: 600px) {
  .cols-3 { grid-template-columns: repeat(2, 1fr); }
  .cols-2 { grid-template-columns: 1fr; }
  .coucher-options { flex-direction: column; }
}
</style>

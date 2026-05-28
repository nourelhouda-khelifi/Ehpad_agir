<template>
  <div v-if="isOpen" class="modal-overlay" @click.self="closeModal">
    <div class="modal-content">
      <!-- Header -->
      <div class="modal-header">
        <h2>Ajouter un Aide-Soignant</h2>
        <button class="close-btn" @click="closeModal">✕</button>
      </div>

      <!-- Form -->
      <form @submit.prevent="submitForm" class="form">
        <!-- Row 1: Code, Nom, Prénom -->
        <div class="form-row">
          <div class="form-group">
            <label for="code">Code *</label>
            <input
              id="code"
              v-model="formData.code"
              type="text"
              placeholder="ex: SE1"
              required
            />
          </div>
          <div class="form-group">
            <label for="nom">Nom *</label>
            <input
              id="nom"
              v-model="formData.nom"
              type="text"
              placeholder="ex: Dupont"
              required
            />
          </div>
          <div class="form-group">
            <label for="prenom">Prénom *</label>
            <input
              id="prenom"
              v-model="formData.prenom"
              type="text"
              placeholder="ex: Marie"
              required
            />
          </div>
        </div>

        <!-- Row 2: Secteur, Couleur -->
        <div class="form-row">
          <div class="form-group">
            <label for="secteur">Secteur</label>
            <input
              id="secteur"
              v-model="formData.secteur"
              type="text"
              placeholder="ex: Est"
            />
          </div>
          <div class="form-group">
            <label for="color">Couleur</label>
            <input
              id="color"
              v-model="formData.color"
              type="color"
            />
          </div>
          <div class="form-group checkbox">
            <label for="actif">
              <input
                id="actif"
                v-model="formData.actif"
                type="checkbox"
              />
              Actif
            </label>
          </div>
        </div>

        <!-- Error Message -->
        <div v-if="errorMessage" class="error-message">
          {{ errorMessage }}
        </div>

        <!-- Buttons -->
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" @click="closeModal">
            Annuler
          </button>
          <button type="submit" class="btn btn-primary" :disabled="isSubmitting">
            {{ isSubmitting ? 'Création...' : 'Créer l\'AS' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAidesSoignants } from '@/composables/useAidesSoignants'

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close', 'created'])

const { createAideSoignant } = useAidesSoignants()

const formData = ref({
  code: '',
  nom: '',
  prenom: '',
  secteur: '',
  color: '#3498db',
  actif: true
})

const isSubmitting = ref(false)
const errorMessage = ref('')

const closeModal = () => {
  emit('close')
  resetForm()
}

const resetForm = () => {
  formData.value = {
    code: '',
    nom: '',
    prenom: '',
    secteur: '',
    color: '#3498db',
    actif: true
  }
  errorMessage.value = ''
}

const submitForm = async () => {
  errorMessage.value = ''

  // Validations
  if (!formData.value.code.trim()) {
    errorMessage.value = 'Le code est obligatoire'
    return
  }
  if (!formData.value.nom.trim()) {
    errorMessage.value = 'Le nom est obligatoire'
    return
  }
  if (!formData.value.prenom.trim()) {
    errorMessage.value = 'Le prénom est obligatoire'
    return
  }

  isSubmitting.value = true

  try {
    const newAideSoignant = await createAideSoignant(formData.value)
    emit('created', newAideSoignant)
    closeModal()
  } catch (error) {
    errorMessage.value = error.message || 'Erreur lors de la création de l\'aide-soignant'
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: var(--radius-lg);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  max-width: 600px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 24px 16px 24px;
  border-bottom: 1px solid var(--color-border-light);
}

.modal-header h2 {
  font-size: 18px;
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 0;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  color: var(--color-text-secondary);
  cursor: pointer;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-md);
  transition: all 0.15s ease;
}

.close-btn:hover {
  background: var(--color-bg-secondary);
  color: var(--color-text-primary);
}

.form {
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 16px;
}

.form-row > .form-group:nth-child(2) {
  grid-column: 2;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-group.checkbox {
  flex-direction: row;
  align-items: center;
  gap: 8px;
}

.form-group.checkbox label {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0;
  font-weight: 400;
}

.form-group.checkbox input {
  width: auto;
  margin: 0;
}

.form-group label {
  font-size: 13px;
  font-weight: 500;
  color: var(--color-text-primary);
}

.form-group input,
.form-group select {
  padding: 9px 12px;
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-md);
  font-size: 13px;
  font-family: inherit;
  transition: all 0.15s ease;
}

.form-group input[type="color"] {
  padding: 4px;
  height: 36px;
  cursor: pointer;
}

.form-group input:focus,
.form-group select:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
}

.form-group input:disabled,
.form-group select:disabled {
  background: var(--color-bg-secondary);
  color: var(--color-text-secondary);
  cursor: not-allowed;
}

.error-message {
  padding: 12px 16px;
  background: #fee;
  border: 1px solid #fcc;
  border-radius: var(--radius-md);
  color: #c00;
  font-size: 13px;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 20px 24px;
  border-top: 1px solid var(--color-border-light);
}

.btn {
  padding: 9px 16px;
  border-radius: var(--radius-md);
  font-size: 13px;
  font-weight: 500;
  transition: all 0.15s ease;
  border: none;
  cursor: pointer;
}

.btn-secondary {
  background: white;
  border: 1px solid var(--color-border-light);
  color: var(--color-text-primary);
}

.btn-secondary:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
}

.btn-primary {
  background: var(--color-primary);
  color: white;
  border: 1px solid var(--color-primary);
}

.btn-primary:hover:not(:disabled) {
  background: var(--color-primary-dark);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>

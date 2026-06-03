<template>
  <div v-if="isOpen" class="modal-overlay" @click.self="closeModal">
    <div class="modal-content">
      <!-- Header -->
      <div class="modal-header">
        <h2>Créer un nouveau patient</h2>
        <button class="close-btn" @click="closeModal">✕</button>
      </div>

      <!-- Form -->
      <form @submit.prevent="submitForm" class="patient-form">
        <!-- Row 1: Chambre, Nom, Prénom -->
        <div class="form-row">
          <div class="form-group">
            <label for="numeroChambre">Chambre *</label>
            <input
              id="numeroChambre"
              v-model="formData.numeroChambre"
              type="text"
              placeholder="ex: 101"
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

        <!-- Row 2: Étage, Statut, Catégorie -->
        <div class="form-row">
          <div class="form-group">
            <label for="etage">Étage</label>
            <input
              id="etage"
              v-model.number="formData.etage"
              type="number"
              min="0"
              max="5"
            />
          </div>
          <div class="form-group">
            <label for="statut">Statut</label>
            <select id="statut" v-model="formData.statut">
              <option value="">Non défini</option>
              <option value="HOSPITALISE">🏥 Hospitalisé</option>
              <option value="AMBULATOIRE">🚶 Ambulatoire</option>
              <option value="CONGE">🏡 En congé</option>
              <option value="DECES">⚠️ Décès</option>
            </select>
          </div>
        </div>

        <!-- Row 3: Catégorie, Profil et Temps -->
        <div class="form-row">
          <div class="form-group">
            <label for="categorie">Catégorie</label>
            <select id="categorie" v-model="formData.categorie">
              <option value="">Non défini</option>
              <option value="CAT1">🚶 Catégorie 1</option>
              <option value="CAT2">🤝 Catégorie 2</option>
              <option value="CAT3">🧠 Catégorie 3</option>
              <option value="CAT4">⚠️ Catégorie 4</option>
            </select>
          </div>
          <div class="form-group">
            <label for="profil">Profil</label>
            <select id="profil" v-model="formData.profil">
              <option value="">Non défini</option>
              <option v-for="profil in profilListe" :key="profil.id" :value="profil.id">
                Profil {{ profil.numero }} - {{ profil.label }}
              </option>
            </select>
          </div>
          <div class="form-group">
            <label for="tempsToiletteLit">Temps toilette lit (min)</label>
            <input
              id="tempsToiletteLit"
              v-model.number="formData.tempsToiletteLit"
              type="number"
              min="0"
            />
          </div>
          <div class="form-group">
            <label for="tempsToiletteVasque">Temps toilette vasque (min)</label>
            <input
              id="tempsToiletteVasque"
              v-model.number="formData.tempsToiletteVasque"
              type="number"
              min="0"
            />
          </div>
        </div>

        <!-- Row 4: Temps moyens -->
        <div class="form-row">
          <div class="form-group">
            <label for="tempsToiletteMoyen">Temps toilette moyen (min)</label>
            <input
              id="tempsToiletteMoyen"
              v-model.number="formData.tempsToiletteMoyen"
              type="number"
              min="0"
            />
          </div>
          <div class="form-group">
            <label for="tempsWcMoyen">Temps WC moyen (min)</label>
            <input
              id="tempsWcMoyen"
              v-model.number="formData.tempsWcMoyen"
              type="number"
              min="0"
            />
          </div>
          <div class="form-group">
            <label for="tempsCoucherMoyen">Temps coucher moyen (min)</label>
            <input
              id="tempsCoucherMoyen"
              v-model.number="formData.tempsCoucherMoyen"
              type="number"
              min="0"
            />
          </div>
        </div>

        <!-- Row 5: Checkboxes -->
        <div class="form-row">
          <div class="form-group checkbox">
            <label for="aideSoignant">
              <input
                id="aideSoignant"
                v-model="formData.aideSoignant"
                type="checkbox"
              />
              Aide soignant
            </label>
          </div>
          <div class="form-group checkbox">
            <label for="petitDejeunerAide">
              <input
                id="petitDejeunerAide"
                v-model="formData.petitDejeunerAide"
                type="checkbox"
              />
              Petit déjeuner aidé
            </label>
          </div>
          <div class="form-group checkbox">
            <label for="sansDouche">
              <input
                id="sansDouche"
                v-model="formData.sansDouche"
                type="checkbox"
              />
              Sans douche
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
            {{ isSubmitting ? 'Création...' : 'Créer le patient' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { usePatients } from '@/composables/usePatients'
import { PATIENT_PROFILS } from '@/data/mockPatientProfils.js'

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true
  }
})

const emit = defineEmits(['close', 'patient-created'])

const { createPatient } = usePatients()

const isSubmitting = ref(false)
const errorMessage = ref('')

// Computed : liste des profils triés
const profilListe = computed(() =>
  Object.values(PATIENT_PROFILS).sort((a, b) => a.numero - b.numero)
)

const formData = ref({
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
  sansDouche: false
})

const closeModal = () => {
  resetForm()
  emit('close')
}

const resetForm = () => {
  formData.value = {
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
    sansDouche: false
  }
  errorMessage.value = ''
}

const submitForm = async () => {
  errorMessage.value = ''
  isSubmitting.value = true

  try {
    // Nettoyer les champs vides ou null
    const dataToSend = {
      numeroChambre: formData.value.numeroChambre || undefined,
      nom: formData.value.nom,
      prenom: formData.value.prenom,
      etage: formData.value.etage || undefined,
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
      sansDouche: formData.value.sansDouche
    }

    // Créer le patient
    const newPatient = await createPatient(dataToSend)
    
    // Émettre l'événement pour signaler la création
    emit('patient-created', newPatient)
    
    // Fermer le modal
    closeModal()
  } catch (error) {
    console.error('Erreur lors de la création du patient:', error)
    errorMessage.value = error.message || 'Erreur lors de la création du patient'
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped>
/* Modal Overlay */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

/* Modal Content */
.modal-content {
  background: white;
  border-radius: 12px;
  max-width: 800px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px;
  border-bottom: 1px solid #E2E8F0;
  background: linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%);
}

.modal-header h2 {
  color: white;
  margin: 0;
  font-size: 18px;
  font-weight: 600;
}

.close-btn {
  background: none;
  border: none;
  color: white;
  font-size: 24px;
  cursor: pointer;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: opacity 0.2s;
}

.close-btn:hover {
  opacity: 0.8;
}

/* Form */
.patient-form {
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 16px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  font-weight: 600;
  font-size: 13px;
  color: #1E293B;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.form-group input,
.form-group select {
  padding: 10px 12px;
  border: 1.5px solid #E2E8F0;
  border-radius: 8px;
  font-size: 13px;
  font-family: inherit;
  transition: all 0.2s;
  background: white;
}

.form-group input:focus,
.form-group select:focus {
  outline: none;
  border-color: #2563EB;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
  background: #F0F9FF;
}

.form-group input::placeholder {
  color: #94A3B8;
}

.form-group.checkbox {
  flex-direction: row;
  align-items: center;
  gap: 12px;
}

.form-group.checkbox label {
  display: flex;
  align-items: center;
  gap: 8px;
  text-transform: none;
  letter-spacing: normal;
  margin: 0;
  font-weight: 500;
  cursor: pointer;
}

.form-group.checkbox input {
  width: 20px;
  height: 20px;
  cursor: pointer;
}

/* Error Message */
.error-message {
  padding: 12px 16px;
  background-color: #FEE2E2;
  border: 1px solid #FECACA;
  border-radius: 8px;
  color: #DC2626;
  font-size: 13px;
  font-weight: 500;
}

/* Modal Footer */
.modal-footer {
  display: flex;
  gap: 12px;
  padding: 16px 24px;
  border-top: 1px solid #E2E8F0;
  background-color: #F8FAFC;
  justify-content: flex-end;
}

.btn {
  padding: 10px 16px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-primary {
  background-color: #2563EB;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background-color: #1D4ED8;
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.2);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-secondary {
  background-color: white;
  color: #1E293B;
  border: 1.5px solid #E2E8F0;
}

.btn-secondary:hover {
  border-color: #CBD5E1;
  background-color: #F8FAFC;
}

/* Responsive */
@media (max-width: 768px) {
  .modal-content {
    width: 95%;
    max-height: 95vh;
  }

  .form-row {
    grid-template-columns: 1fr;
  }

  .modal-footer {
    flex-direction: column;
  }

  .btn {
    width: 100%;
  }
}
</style>

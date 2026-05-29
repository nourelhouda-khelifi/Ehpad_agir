<template>
  <div v-if="isOpen" class="modal-overlay" @click.self="close">
    <div class="modal-content">
      <div class="modal-header">
        <h2>Gérer les absences - {{ aideSoignantNom }}</h2>
        <button class="close-btn" @click="close">✕</button>
      </div>

      <div class="modal-body">
        <!-- Formulaire d'ajout -->
        <div class="form-section">
          <h3>Ajouter une absence</h3>
          <form @submit.prevent="addAbsence" class="absence-form">
            <div class="form-group">
              <label>Date de début</label>
              <input v-model="newAbsence.dateDebut" type="date" required class="form-input">
            </div>

            <div class="form-group">
              <label>Date de fin</label>
              <input v-model="newAbsence.dateFin" type="date" required class="form-input">
            </div>

            <div class="form-group">
              <label>Raison</label>
              <select v-model="newAbsence.raison" required class="form-input">
                <option value="">-- Sélectionner --</option>
                <option value="MALADIE">Maladie</option>
                <option value="CONGE">Congé</option>
                <option value="FORMATION">Formation</option>
                <option value="AUTRE">Autre</option>
              </select>
            </div>

            <div class="form-group">
              <label>Commentaire (optionnel)</label>
              <input v-model="newAbsence.commentaire" type="text" placeholder="Ex: Grippe" class="form-input">
            </div>

            <button type="submit" class="btn-submit">Ajouter l'absence</button>
          </form>
        </div>

        <!-- Liste des absences -->
        <div class="absences-list-section">
          <h3>Absences enregistrées</h3>
          <div v-if="absences.length > 0" class="absences-list">
            <div v-for="absence in absences" :key="absence.id" class="absence-item" :class="{ annulee: absence.statut === 'ANNULEE' }">
              <div class="absence-info">
                <div class="dates">
                  <strong>{{ formatDate(absence.dateDebut) }}</strong> → <strong>{{ formatDate(absence.dateFin) }}</strong>
                  <span class="duration">({{ getDuration(absence.dateDebut, absence.dateFin) }} jours)</span>
                </div>
                <div class="raison">
                  <span class="badge" :class="getRaisonClass(absence.raison)">{{ absence.raison }}</span>
                </div>
                <div v-if="absence.commentaire" class="commentaire">{{ absence.commentaire }}</div>
              </div>

              <div class="absence-actions">
                <span v-if="absence.statut === 'ANNULEE'" class="status-badge annulee-badge">Annulée</span>
                <button 
                  v-else
                  @click="annulerAbsence(absence.id)" 
                  class="btn-annuler"
                  title="Annuler cette absence"
                >
                  Annuler
                </button>
              </div>
            </div>
          </div>
          <div v-else class="no-absences">Aucune absence enregistrée</div>
        </div>
      </div>

      <div class="modal-footer">
        <button @click="close" class="btn-close">Fermer</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { absenceService } from '@/api/services/absenceService.js'

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true
  },
  aideSoignantId: {
    type: Number,
    required: true
  },
  aideSoignantNom: {
    type: String,
    default: 'Aide-soignant'
  }
})

const emit = defineEmits(['close'])

const absences = ref([])
const newAbsence = ref({
  dateDebut: '',
  dateFin: '',
  raison: '',
  commentaire: ''
})

/**
 * Charger les absences de l'aide-soignant
 */
const loadAbsences = async () => {
  try {
    const result = await absenceService.getByAideSoignant(props.aideSoignantId)
    const data = Array.isArray(result) ? result : result.value || []
    absences.value = data
  } catch (err) {
    console.error('Erreur lors du chargement des absences:', err)
  }
}

/**
 * Ajouter une nouvelle absence
 */
const addAbsence = async () => {
  if (!newAbsence.value.dateDebut || !newAbsence.value.dateFin || !newAbsence.value.raison) {
    alert('Veuillez remplir tous les champs requis')
    return
  }

  try {
    await absenceService.create({
      aideSoignantId: props.aideSoignantId,
      dateDebut: newAbsence.value.dateDebut,
      dateFin: newAbsence.value.dateFin,
      raison: newAbsence.value.raison,
      commentaire: newAbsence.value.commentaire,
      statut: 'ACTIVE'
    })

    // Réinitialiser le formulaire
    newAbsence.value = {
      dateDebut: '',
      dateFin: '',
      raison: '',
      commentaire: ''
    }

    // Recharger la liste
    await loadAbsences()
  } catch (err) {
    console.error('Erreur lors de l\'ajout d\'absence:', err)
    alert('Erreur lors de l\'ajout de l\'absence')
  }
}

/**
 * Annuler une absence
 */
const annulerAbsence = async (absenceId) => {
  if (!confirm('Êtes-vous sûr de vouloir annuler cette absence ?')) return

  try {
    await absenceService.annuler(absenceId)
    await loadAbsences()
  } catch (err) {
    console.error('Erreur lors de l\'annulation d\'absence:', err)
    alert('Erreur lors de l\'annulation de l\'absence')
  }
}

/**
 * Formater une date
 */
const formatDate = (dateStr) => {
  const date = new Date(dateStr + 'T00:00:00')
  return date.toLocaleDateString('fr-FR', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })
}

/**
 * Calculer la durée en jours
 */
const getDuration = (dateDebut, dateFin) => {
  const start = new Date(dateDebut + 'T00:00:00')
  const end = new Date(dateFin + 'T00:00:00')
  const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1
  return days
}

/**
 * Obtenir la classe CSS pour le badge raison
 */
const getRaisonClass = (raison) => {
  const classes = {
    MALADIE: 'raison-maladie',
    CONGE: 'raison-conge',
    FORMATION: 'raison-formation',
    AUTRE: 'raison-autre'
  }
  return classes[raison] || 'raison-autre'
}

/**
 * Fermer le modal
 */
const close = () => {
  emit('close')
}

/**
 * Charger les absences quand le modal s'ouvre
 */
watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    loadAbsences()
  }
})
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
  border-radius: 8px;
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #eee;
}

.modal-header h2 {
  margin: 0;
  font-size: 18px;
  color: #333;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #999;
}

.close-btn:hover {
  color: #333;
}

.modal-body {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
}

.form-section {
  background: #f9f9f9;
  padding: 15px;
  border-radius: 6px;
  margin-bottom: 20px;
}

.form-section h3 {
  margin-top: 0;
  color: #333;
  font-size: 14px;
}

.absence-form {
  display: grid;
  gap: 10px;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group label {
  font-size: 12px;
  font-weight: 500;
  margin-bottom: 4px;
  color: #555;
}

.form-input {
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  font-family: inherit;
}

.form-input:focus {
  outline: none;
  border-color: #378ADD;
  box-shadow: 0 0 0 2px rgba(55, 138, 221, 0.1);
}

.btn-submit {
  background: #378ADD;
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  margin-top: 5px;
}

.btn-submit:hover {
  background: #2563a5;
}

.absences-list-section h3 {
  margin-top: 0;
  color: #333;
  font-size: 14px;
}

.absences-list {
  display: grid;
  gap: 10px;
}

.absence-item {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 12px;
  background: #f9f9f9;
  border-left: 4px solid #378ADD;
  border-radius: 4px;
}

.absence-item.annulee {
  opacity: 0.6;
  border-left-color: #999;
}

.absence-info {
  flex: 1;
}

.dates {
  font-size: 13px;
  color: #333;
  margin-bottom: 5px;
}

.duration {
  color: #999;
  font-size: 12px;
}

.raison {
  margin-bottom: 5px;
}

.badge {
  display: inline-block;
  padding: 3px 8px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 500;
  text-transform: uppercase;
}

.raison-maladie {
  background: #fee2e2;
  color: #991b1b;
}

.raison-conge {
  background: #dcfce7;
  color: #166534;
}

.raison-formation {
  background: #dbeafe;
  color: #1e40af;
}

.raison-autre {
  background: #f3f4f6;
  color: #374151;
}

.commentaire {
  font-size: 12px;
  color: #666;
  font-style: italic;
}

.absence-actions {
  display: flex;
  gap: 10px;
  margin-left: 10px;
}

.btn-annuler {
  background: #f3f4f6;
  color: #333;
  border: 1px solid #d1d5db;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  white-space: nowrap;
}

.btn-annuler:hover {
  background: #e5e7eb;
}

.status-badge {
  padding: 6px 12px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
}

.annulee-badge {
  background: #fee2e2;
  color: #991b1b;
}

.no-absences {
  text-align: center;
  color: #999;
  font-size: 14px;
  padding: 20px;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding: 15px 20px;
  border-top: 1px solid #eee;
}

.btn-close {
  background: #f3f4f6;
  color: #333;
  border: 1px solid #d1d5db;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.btn-close:hover {
  background: #e5e7eb;
}
</style>

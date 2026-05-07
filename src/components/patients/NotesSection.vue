<template>
  <div class="notes-section">
    <div class="notes-form">
      <textarea
        v-model="newNote"
        placeholder="Ajouter une note ou un commentaire..."
        rows="3"
        class="note-input"
      ></textarea>
      <div class="form-actions">
        <label class="checkbox-label">
          <input type="checkbox" v-model="isImportant" />
          Marquer comme important
        </label>
        <button
          class="btn-save"
          :disabled="!newNote.trim()"
          @click="addNote"
        >
          Ajouter la note
        </button>
      </div>
    </div>

    <div class="notes-list">
      <div v-if="notes.length === 0" class="empty-state">
        <span>💬</span>
        <p>Aucune note pour ce patient</p>
      </div>
      <div
        v-for="note in notes"
        :key="note.id"
        class="note-item"
        :class="{ 'is-important': note.important }"
      >
        <div class="note-header">
          <span class="note-author">{{ note.auteur }}</span>
          <span v-if="note.important" class="note-flag">⚠️ Important</span>
          <span class="note-date">{{ formatDate(note.date) }}</span>
        </div>
        <div class="note-content">{{ note.contenu }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  notes: { type: Array, required: true }
})

const emit = defineEmits(['add-note'])

const newNote = ref('')
const isImportant = ref(false)

const addNote = () => {
  if (!newNote.value.trim()) return
  emit('add-note', {
    contenu: newNote.value.trim(),
    important: isImportant.value
  })
  newNote.value = ''
  isImportant.value = false
}

const formatDate = (date) => {
  const d = new Date(date)
  return d.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  })
}
</script>

<style scoped>
.notes-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* Form */
.notes-form {
  background: var(--color-bg-secondary);
  border-radius: var(--radius-md);
  padding: 14px;
}

.note-input {
  width: 100%;
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-md);
  padding: 10px 12px;
  font-size: 13px;
  font-family: inherit;
  resize: vertical;
  outline: none;
  background: white;
  transition: border-color 0.15s ease;
}

.note-input:focus {
  border-color: var(--color-primary);
}

.form-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: var(--color-text-secondary);
  cursor: pointer;
}

.btn-save {
  background: var(--color-primary);
  color: white;
  padding: 8px 16px;
  border-radius: var(--radius-md);
  font-size: 13px;
  font-weight: 500;
  transition: background 0.15s ease;
}

.btn-save:hover:not(:disabled) {
  background: var(--color-primary-dark);
}

.btn-save:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Notes list */
.notes-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.note-item {
  background: white;
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-md);
  padding: 12px 14px;
}

.note-item.is-important {
  background: var(--color-warning-light);
  border-color: var(--color-warning);
}

.note-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;
  font-size: 12px;
}

.note-author {
  font-weight: 600;
  color: var(--color-text-primary);
}

.note-flag {
  background: var(--color-warning);
  color: white;
  padding: 1px 6px;
  border-radius: var(--radius-sm);
  font-size: 10px;
  font-weight: 600;
}

.note-date {
  margin-left: auto;
  color: var(--color-text-tertiary);
}

.note-content {
  font-size: 13px;
  color: var(--color-text-primary);
  line-height: 1.5;
}

/* Empty */
.empty-state {
  text-align: center;
  padding: 30px;
  color: var(--color-text-tertiary);
}

.empty-state span {
  font-size: 28px;
  display: block;
  margin-bottom: 8px;
}

.empty-state p {
  font-size: 13px;
}
</style>
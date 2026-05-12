<template>
  <div class="patients-table-wrapper">
    <table class="patients-table">
      <thead>
        <tr>
          <th @click="$emit('sort', 'chambre')" class="sortable">
            Chambre
            <span v-if="sortKey === 'chambre'" class="sort-indicator">
              {{ sortOrder === 'asc' ? '↑' : '↓' }}
            </span>
          </th>
          <th>Nom</th>
          <th>Prénom</th>
          <th>Catégorie</th>
          <th>Profil</th>
          <th>Priorité</th>
          <th>Temps moyen WC</th>
          <th>Temps moyen coucher</th>
          <th>Alertes</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr 
          v-for="patient in patients" 
          :key="patient.id" 
          class="patient-row" 
          :class="{ 'dragging': draggedPatientId === patient.id, 'drag-over': dragOverPatientId === patient.id }"
          :style="{ borderLeftColor: getCategoryColor(patient.categorie), borderLeftWidth: '3px' }"
          draggable="true"
          @dragstart="onDragStart(patient.id, $event)"
          @dragover.prevent="onDragOver(patient.id)"
          @dragleave="onDragLeave"
          @drop.prevent="onDrop(patient.id)"
          @dragend="onDragEnd"
        >
          <td class="chamber">
            <span class="drag-handle" :title="`Glissez pour réorganiser`">⋮⋮</span>
            {{ patient.chambre }}
          </td>
          <td>{{ patient.nom }}</td>
          <td>{{ patient.prenom }}</td>
          <td class="category-cell">
            <select 
              :value="patient.categorie" 
              @change="$emit('update-patient', patient.id, 'categorie', $event.target.value)"
              class="cell-select"
            >
              <option value="">🔹 Non défini</option>
              <option v-for="cat in categories" :key="cat.id" :value="cat.id">
                {{ cat.icon }} {{ cat.label }}
              </option>
            </select>
          </td>
          <td class="profil-cell">
            <select 
              :value="patient.profil" 
              @change="$emit('update-patient', patient.id, 'profil', $event.target.value)"
              class="cell-select"
            >
              <option value="">🔹 Non défini</option>
              <option v-for="prof in profils" :key="prof.id" :value="prof.id">
                P{{ prof.numero }} - {{ prof.label }}
              </option>
            </select>
          </td>
          <td class="priority-cell">
            <select 
              :value="patient.priorite || getPatientPriority(patient.profil)" 
              @change="$emit('update-patient', patient.id, 'priorite', $event.target.value ? parseInt($event.target.value) : null)"
              class="cell-select priority-select"
            >
              <option value="">🔹 Non défini</option>
              <option value="1">1 - Basse</option>
              <option value="2">2 - Normale</option>
              <option value="3">3 - Haute</option>
              <option value="4">4 - Critique</option>
            </select>
          </td>
          <td class="temps-cell">
            <span v-if="patient.tempsWCMoyen > 0">{{ patient.tempsWCMoyen }} min</span>
            <span v-else class="no-data">-</span>
          </td>
          <td class="temps-cell">
            <span v-if="patient.tempsCoucherMoyen > 0">{{ patient.tempsCoucherMoyen }} min</span>
            <span v-else class="no-data">-</span>
          </td>
          <td class="alerts-cell">
            <span v-if="patient.alertes > 0" class="alert-badge">
              ⚠️ {{ patient.alertes }}
            </span>
            <span v-else class="no-alert">-</span>
          </td>
          <td>
            <div class="action-buttons">
              <button 
                v-if="getPatientIndex(patient.id) > 0"
                class="order-btn" 
                title="Monter"
                @click="$emit('move-patient', patient.id, -1)"
              >
                ▲
              </button>
              <button 
                v-if="getPatientIndex(patient.id) < patients.length - 1"
                class="order-btn" 
                title="Descendre"
                @click="$emit('move-patient', patient.id, 1)"
              >
                ▼
              </button>
              <button class="action-btn" @click="$emit('open-patient', patient.id)">
                Voir détails
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { PATIENT_CATEGORIES, PATIENT_PROFILS } from '@/data/mockPatientProfils.js'

const props = defineProps({
  patients: { type: Array, required: true },
  sortKey: { type: String, default: 'chambre' },
  sortOrder: { type: String, default: 'asc' }
})

const emit = defineEmits(['open-patient', 'sort', 'update-patient', 'reorder-patients', 'move-patient'])

const draggedPatientId = ref(null)
const dragOverPatientId = ref(null)

const categories = computed(() => Object.values(PATIENT_CATEGORIES))
const profils = computed(() => 
  Object.values(PATIENT_PROFILS).sort((a, b) => a.numero - b.numero)
)

function getCategoryColor(categoryId) {
  return PATIENT_CATEGORIES[categoryId]?.color || '#9CA3AF'
}

function getPatientPriority(profilId) {
  const profil = PATIENT_PROFILS[profilId]
  return profil ? profil.priorite : 1
}
function getPatientIndex(patientId) {
  return props.patients.findIndex(p => p.id === patientId)
}
function onDragStart(patientId, event) {
  draggedPatientId.value = patientId
  event.dataTransfer.effectAllowed = 'move'
  event.dataTransfer.setData('text/plain', patientId)
}

function onDragOver(patientId) {
  if (draggedPatientId.value !== patientId) {
    dragOverPatientId.value = patientId
  }
}

function onDragLeave() {
  dragOverPatientId.value = null
}

function onDrop(targetPatientId) {
  if (draggedPatientId.value && draggedPatientId.value !== targetPatientId) {
    const sourceIndex = props.patients.findIndex(p => p.id === draggedPatientId.value)
    const targetIndex = props.patients.findIndex(p => p.id === targetPatientId)
    
    if (sourceIndex !== -1 && targetIndex !== -1) {
      const newPatients = [...props.patients]
      const [draggedPatient] = newPatients.splice(sourceIndex, 1)
      newPatients.splice(targetIndex, 0, draggedPatient)
      emit('reorder-patients', newPatients)
    }
  }
  dragOverPatientId.value = null
}

function onDragEnd() {
  draggedPatientId.value = null
  dragOverPatientId.value = null
}
</script>

<style scoped>
.patients-table-wrapper {
  background: white;
  border-radius: 12px;
  border: 1px solid #E2E8F0;
  overflow: hidden;
  margin-bottom: 0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.patients-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}

thead {
  background: linear-gradient(to bottom, #F8FAFC, #F1F5F9);
  border-bottom: 2px solid #E2E8F0;
}

th {
  padding: 14px 16px;
  text-align: left;
  font-weight: 700;
  color: #1E293B;
  user-select: none;
  letter-spacing: 0.3px;
}

th.sortable {
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  width: fit-content;
  transition: color 0.2s ease;
}

th.sortable:hover {
  color: #2563EB;
}

.sort-indicator {
  font-size: 11px;
  color: #2563EB;
  font-weight: 600;
}

tbody tr {
  border-bottom: 1px solid #F1F5F9;
  transition: all 0.15s ease;
  cursor: grab;
}

tbody tr:hover {
  background: #F8FAFC;
}

tbody tr.dragging {
  opacity: 0.5;
  background: #E0E7FF;
  cursor: grabbing;
}

tbody tr.drag-over {
  background: #DDD6FE;
  border-top: 3px solid #6366F1;
  border-bottom: 3px solid #6366F1;
}

td {
  padding: 14px 16px;
  color: #1E293B;
}

.chamber {
  font-weight: 700;
  color: #2563EB;
  font-size: 13px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.drag-handle {
  cursor: grab;
  color: #9CA3AF;
  font-weight: 900;
  font-size: 14px;
  transition: color 0.2s ease;
  user-select: none;
}

.patient-row:hover .drag-handle {
  color: #6B7280;
}

.action-buttons {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  align-items: center;
}

.order-btn {
  padding: 4px 8px;
  border: 1px solid #D1D5DB;
  background: white;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  font-weight: 600;
  color: #2563EB;
  transition: all 0.2s ease;
  min-width: 28px;
}

.order-btn:hover {
  background: #EFF6FF;
  border-color: #2563EB;
  transform: scale(1.1);
}

.order-btn:active {
  transform: scale(0.95);
}

.category-cell {
  font-size: 12px;
}

.profil-cell {
  font-size: 12px;
}

.cell-select {
  padding: 6px 8px;
  border: 1px solid #D1D5DB;
  border-radius: 4px;
  font-size: 12px;
  background: white;
  color: #1E293B;
  cursor: pointer;
  transition: all 0.2s ease;
  width: 100%;
  max-width: 180px;
  font-family: inherit;
}

.cell-select:hover {
  border-color: #9CA3AF;
  background: #F8FAFC;
}

.cell-select:focus {
  outline: none;
  border-color: #2563EB;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

.priority-cell {
  font-size: 12px;
  text-align: center;
}

.priority-select {
  padding: 6px 8px;
  border: 1px solid #D1D5DB;
  border-radius: 4px;
  font-size: 12px;
  background: white;
  color: #1E293B;
  cursor: pointer;
  transition: all 0.2s ease;
  width: 100%;
  max-width: 150px;
  font-family: inherit;
}

.priority-select:hover {
  border-color: #9CA3AF;
  background: #F8FAFC;
}

.priority-select:focus {
  outline: none;
  border-color: #2563EB;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

.priority-1 {
  background: #10B981; /* Vert - Priorité 1 */
}

.priority-2 {
  background: #F59E0B; /* Ambre - Priorité 2 */
}

.priority-3 {
  background: #EF4444; /* Rouge - Priorité 3 */
}

.priority-4 {
  background: #7C3AED; /* Violet - Priorité 4 */
}

.etage-badge {
  text-align: center;
}

.temps-cell {
  text-align: center;
  font-size: 13px;
}

.no-data {
  color: #94A3B8;
}

.status-badge {
  display: inline-block;
  padding: 5px 12px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  background: #F0F9FF;
  color: #0369A1;
  text-transform: capitalize;
}

.alerts-cell {
  text-align: center;
}

.alert-badge {
  display: inline-block;
  padding: 5px 10px;
  background: #FEE2E2;
  color: #DC2626;
  border-radius: 6px;
  font-weight: 700;
  font-size: 12px;
}

.no-alert {
  color: #94A3B8;
  font-weight: 500;
}

.action-btn {
  padding: 8px 14px;
  border: 1.5px solid #2563EB;
  border-radius: 6px;
  background: white;
  color: #2563EB;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.action-btn:hover {
  background: #2563EB;
  color: white;
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.2);
}

@media (max-width: 768px) {
  th, td {
    padding: 10px 12px;
    font-size: 12px;
  }

  .action-btn {
    padding: 6px 10px;
    font-size: 11px;
  }

  .badge {
    padding: 4px 8px;
    font-size: 11px;
  }
}
</style>

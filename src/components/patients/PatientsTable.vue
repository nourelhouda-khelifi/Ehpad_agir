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
          <th @click="$emit('sort', 'etage')" class="sortable">
            Étage
            <span v-if="sortKey === 'etage'" class="sort-indicator">
              {{ sortOrder === 'asc' ? '↑' : '↓' }}
            </span>
          </th>
          <th>Statut</th>
          <th>Alertes</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="patient in patients" :key="patient.id" class="patient-row">
          <td class="chamber">{{ patient.chambre }}</td>
          <td>{{ patient.nom }}</td>
          <td>{{ patient.prenom }}</td>
          <td class="etage-badge">
            <span class="badge" :class="`badge-etage-${patient.etage}`">
              {{ patient.etage === 1 ? '1er étage' : '2ème étage' }}
            </span>
          </td>
          <td>
            <span class="status-badge" :class="`status-${patient.statut}`">
              {{ patient.statut }}
            </span>
          </td>
          <td class="alerts-cell">
            <span v-if="patient.alertes > 0" class="alert-badge">
              ⚠️ {{ patient.alertes }}
            </span>
            <span v-else class="no-alert">-</span>
          </td>
          <td>
            <button class="action-btn" @click="$emit('open-patient', patient.id)">
              Voir détails
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
defineProps({
  patients: { type: Array, required: true },
  sortKey: { type: String, default: 'chambre' },
  sortOrder: { type: String, default: 'asc' }
})

defineEmits(['open-patient', 'sort'])
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
}

tbody tr:hover {
  background: #F8FAFC;
}

td {
  padding: 14px 16px;
  color: #1E293B;
}

.chamber {
  font-weight: 700;
  color: #2563EB;
  font-size: 13px;
}

.etage-badge {
  text-align: center;
}

.badge {
  display: inline-block;
  padding: 5px 12px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.2px;
}

.badge-etage-1 {
  background: #DBEAFE;
  color: #0369A1;
}

.badge-etage-2 {
  background: #D1FAE5;
  color: #047857;
}

.badge-etage-3 {
  background: #FCE7F3;
  color: #9D174D;
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

<template>
  <div class="patient-header" :style="{ borderLeftColor: categoryColor, borderLeftWidth: '4px' }">
    <PatientAvatar :nom="patient.nom" :prenom="patient.prenom" :size="64" />
    <div class="patient-info">
      <h1 class="patient-name">
        {{ patient.prenom ? 'Mme ' : 'Mr/Mme ' }}{{ patient.nom }}{{ patient.prenom ? ' ' + patient.prenom : '' }}
      </h1>
      <div class="patient-tags">
        <span class="tag tag-room">📍 Chambre {{ patient.chambre }}</span>
        <span class="tag tag-floor">🏥 B34 - {{ patient.etage === 1 ? '1er' : '2ème' }} étage</span>
        <span class="tag tag-status">
          {{ patient.statut === 'hospitalise' ? '🏥 Hospitalisée' : 'Standard' }}
        </span>
        <CategoryBadge :category-id="patient.categorie" />
        <ProfilBadge :profil-id="patient.profil" />
      </div>
    </div>
    <div class="header-actions">
      <button class="btn btn-secondary">✏️ Modifier</button>
      <button class="btn btn-secondary">🖨️ Imprimer</button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import PatientAvatar from '@/components/ui/PatientAvatar.vue'
import CategoryBadge from '@/components/ui/CategoryBadge.vue'
import ProfilBadge from '@/components/ui/ProfilBadge.vue'
import { PATIENT_CATEGORIES } from '@/data/mockPatientProfils.js'

const props = defineProps({
  patient: { type: Object, required: true }
})

const categoryColor = computed(() => {
  return PATIENT_CATEGORIES[props.patient.categorie]?.color || '#9CA3AF'
})
</script>

<style scoped>
.patient-header {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 24px;
  background: linear-gradient(135deg, #F8FAFC 0%, #EFF6FF 100%);
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-border-light);
  box-shadow: var(--shadow-sm);
  transition: all var(--transition-base);
  animation: slideDown var(--transition-base) ease;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.patient-header:hover {
  box-shadow: var(--shadow-md);
  border-color: #CBD5E1;
  background: linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%);
}

.patient-info {
  flex: 1;
}

.patient-name {
  font-size: 24px;
  font-weight: 700;
  color: var(--color-text-primary);
  margin-bottom: 12px;
  transition: color var(--transition-base);
}

.patient-tags {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.tag {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  border-radius: var(--radius-full);
  font-size: 12px;
  font-weight: 600;
  transition: all var(--transition-fast);
  box-shadow: var(--shadow-xs);
  animation: fadeInScale var(--transition-base) ease;
}

@keyframes fadeInScale {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.tag:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-sm);
}

.tag-room {
  background: linear-gradient(135deg, #FFFCE6 0%, #FAEEDA 100%);
  color: var(--color-text-primary);
  border: 1px solid rgba(239, 192, 12, 0.2);
}

.tag-floor {
  background: white;
  border: 1.5px solid var(--color-border-light);
  color: var(--color-text-secondary);
}

.tag-status {
  background: linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%);
  color: var(--color-primary);
  border: 1px solid rgba(37, 99, 235, 0.2);
}

.header-actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.btn {
  padding: 10px 16px;
  border-radius: var(--radius-md);
  font-size: 13px;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  transition: all var(--transition-fast);
  box-shadow: var(--shadow-xs);
  cursor: pointer;
  border: none;
}

.btn:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-sm);
}

.btn:active {
  transform: translateY(0);
  box-shadow: var(--shadow-xs);
}

.btn-secondary {
  background: white;
  color: var(--color-text-secondary);
  border: 1.5px solid var(--color-border-light);
}

.btn-secondary:hover {
  background: #F8FAFC;
  border-color: #CBD5E1;
  color: var(--color-text-primary);
}
</style>
<template>
  <div class="as-column">
    <!-- Header de colonne -->
    <div class="column-header" :style="headerStyle">
      <div class="column-title">
        {{ as.code }}
        <span v-if="as.niveau === 'surcharge'" class="overload-icon">⚠️</span>
      </div>
      <div class="column-stats">
        {{ totalMinutes }}min · {{ soins.length }} soins
      </div>
    </div>

    <!-- Barre de niveau -->
    <div class="niveau-bar" :style="{ background: niveauColor }"></div>

    <!-- Contenu : liste des soins -->
    <div class="column-body">
      <div v-if="soins.length === 0" class="empty-column">
        <span class="empty-icon">📭</span>
        <p>Aucun soin planifié</p>
      </div>

      <SoinCard
        v-for="soin in soinsTriés"
        :key="soin.id"
        :soin="soin"
        @click="$emit('soin-click', soin)"
      />

      <button class="btn-add" @click="$emit('add-soin', as.code)">
        + Ajouter un soin
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import SoinCard from './SoinCard.vue'

const props = defineProps({
  as: { type: Object, required: true },
  soins: { type: Array, required: true }
})

defineEmits(['soin-click', 'add-soin'])

// Tri chronologique des soins
const soinsTriés = computed(() => {
  return [...props.soins].sort((a, b) => a.heure.localeCompare(b.heure))
})

const totalMinutes = computed(() => {
  return props.soins.reduce((sum, s) => sum + s.duree, 0)
})

const niveauColors = {
  leger: '#97C459',
  normal: '#5DCAA5',
  eleve: '#EF9F27',
  surcharge: '#E24B4A'
}

const niveauColor = computed(() => niveauColors[props.as.niveau] || '#888780')

const headerStyle = computed(() => {
  const colors = {
    SE1: { bg: '#1D9E75' },
    SE2: { bg: '#A32D2D' },
    SC1: { bg: '#185FA5' },
    SC2: { bg: '#5DCAA5' },
    SG: { bg: '#888780' }
  }
  const color = colors[props.as.code] || { bg: '#888780' }
  return { background: color.bg }
})
</script>

<style scoped>
.as-column {
  background: var(--color-bg-secondary);
  border-radius: var(--radius-lg);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  min-height: 400px;
}

/* Header */
.column-header {
  padding: 12px 14px;
  color: white;
  text-align: center;
}

.column-title {
  font-size: 16px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
}

.overload-icon {
  font-size: 14px;
}

.column-stats {
  font-size: 11px;
  opacity: 0.9;
  margin-top: 2px;
}

/* Barre de niveau */
.niveau-bar {
  height: 4px;
}

/* Body */
.column-body {
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
}

/* Empty */
.empty-column {
  text-align: center;
  padding: 30px 10px;
  color: var(--color-text-tertiary);
}

.empty-icon {
  font-size: 24px;
  display: block;
  margin-bottom: 6px;
  opacity: 0.5;
}

.empty-column p {
  font-size: 11px;
}

/* Bouton ajouter */
.btn-add {
  padding: 10px;
  border: 1px dashed var(--color-border);
  border-radius: var(--radius-md);
  background: transparent;
  color: var(--color-text-tertiary);
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s ease;
  margin-top: auto;
}

.btn-add:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
  background: white;
}
</style>

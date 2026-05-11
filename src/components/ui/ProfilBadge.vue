<template>
  <div class="profil-badge" :style="profilStyle">
    <span class="profil-number">P{{ profil.numero }}</span>
    <span class="profil-label">{{ profil.label }}</span>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { PATIENT_PROFILS, PATIENT_CATEGORIES } from '@/data/mockPatientProfils.js'

const props = defineProps({
  profilId: { type: String, required: true }
})

const profil = computed(() => PATIENT_PROFILS[props.profilId] || PATIENT_PROFILS.profil1)

const category = computed(() => PATIENT_CATEGORIES[profil.value.category])

const profilStyle = computed(() => ({
  background: category.value.bgColor,
  borderColor: category.value.color
}))
</script>

<style scoped>
.profil-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 16px;
  border: 1.5px solid;
  font-size: 12px;
  font-weight: 500;
  white-space: nowrap;
  transition: all 0.15s ease;
}

.profil-number {
  font-weight: 700;
  font-size: 11px;
  opacity: 0.9;
}

.profil-badge:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}
</style>

<template>
  <div class="category-badge" :style="categoryStyle">
    <span class="category-icon">{{ category.icon }}</span>
    <span class="category-label">{{ category.label }}</span>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { PATIENT_CATEGORIES } from '@/data/mockPatientProfils.js'

const props = defineProps({
  categoryId: { type: String, required: true }
})

const category = computed(() => PATIENT_CATEGORIES[props.categoryId] || PATIENT_CATEGORIES.cat1)

const categoryStyle = computed(() => ({
  background: category.value.bgColor,
  borderColor: category.value.color
}))
</script>

<style scoped>
.category-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 14px;
  border-radius: 20px;
  border: 2px solid;
  font-size: 13px;
  font-weight: 600;
  white-space: nowrap;
  transition: all 0.15s ease;
}

.category-icon {
  font-size: 16px;
}

.category-badge:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
</style>

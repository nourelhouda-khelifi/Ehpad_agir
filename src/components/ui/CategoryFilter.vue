<template>
  <div class="category-filter">
    <button
      class="filter-btn"
      :class="{ active: modelValue === null }"
      @click="$emit('update:modelValue', null)"
    >
      Toutes catégories
    </button>
    <button
      v-for="category in categories"
      :key="category.id"
      class="filter-btn"
      :class="{ active: modelValue === category.id }"
      :style="{ 
        borderColor: category.color,
        background: modelValue === category.id ? category.bgColor : 'white',
        color: modelValue === category.id ? category.color : '#666'
      }"
      @click="$emit('update:modelValue', category.id)"
    >
      <span>{{ category.icon }}</span>
      <span>{{ category.label }}</span>
    </button>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { PATIENT_CATEGORIES } from '@/data/mockPatientProfils.js'

defineProps({
  modelValue: { type: String, default: null }
})

defineEmits(['update:modelValue'])

const categories = computed(() => Object.values(PATIENT_CATEGORIES))
</script>

<style scoped>
.category-filter {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  padding: 12px 0;
  border-bottom: 1px solid #E2E8F0;
  margin-bottom: 16px;
}

.filter-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  border-radius: 20px;
  border: 2px solid #D1D5DB;
  background: white;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  color: #666;
}

.filter-btn:hover {
  border-color: currentColor;
  transform: translateY(-2px);
}

.filter-btn.active {
  border-width: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
</style>

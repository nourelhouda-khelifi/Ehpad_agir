<template>
  <span class="as-badge" :style="{ background: bgColor }">
    {{ code }}
  </span>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  code: { type: String, required: true }
})

const colorMap = {
  SE1: '#1D9E75',
  SE2: '#E24B4A',
  SC1: '#378ADD',
  SC2: '#5DCAA5',
  SG: '#888780'
}

const bgColor = computed(() => colorMap[props.code] || '#888780')
</script>

<style scoped>
.as-badge {
  display: inline-block;
  padding: 3px 8px;
  border-radius: 4px;
  color: white;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.3px;
}
</style>
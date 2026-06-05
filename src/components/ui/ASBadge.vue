<template>
  <span class="as-badge" :style="{ background: bgColor }">
    {{ code }}
  </span>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  code: { type: String, required: true },
  color: { type: String, default: null }
})

const bgColor = computed(() => props.color || '#888780')
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
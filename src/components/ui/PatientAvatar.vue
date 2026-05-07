<template>
  <div class="patient-avatar" :style="{ width: size + 'px', height: size + 'px', fontSize: fontSize + 'px' }">
    {{ initials }}
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  nom: { type: String, default: '' },
  prenom: { type: String, default: '' },
  size: { type: Number, default: 40 }
})

const initials = computed(() => {
  const n = props.nom.charAt(0).toUpperCase()
  const p = props.prenom.charAt(0).toUpperCase()
  return (p + n) || n || '?'
})

const fontSize = computed(() => Math.floor(props.size / 2.5))
</script>

<style scoped>
.patient-avatar {
  border-radius: 50%;
  background: linear-gradient(135deg, var(--color-primary) 0%, #1D4ED8 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  flex-shrink: 0;
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
  transition: all var(--transition-base);
  user-select: none;
}

.patient-avatar:hover {
  transform: scale(1.05);
  box-shadow: 0 6px 16px rgba(37, 99, 235, 0.4);
}
</style>
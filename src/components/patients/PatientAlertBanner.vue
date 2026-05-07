<template>
  <div v-if="alertes.length > 0" class="alert-banner">
    <div class="alert-banner-header">
      <span class="alert-icon">🚨</span>
      <span class="alert-title">{{ alertes.length }} alerte{{ alertes.length > 1 ? 's' : '' }} active{{ alertes.length > 1 ? 's' : '' }}</span>
    </div>
    <ul class="alert-list">
      <li v-for="(alerte, i) in alertes" :key="i">{{ alerte }}</li>
    </ul>
  </div>
</template>

<script setup>
defineProps({
  alertes: { type: Array, required: true }
})
</script>

<style scoped>
.alert-banner {
  background: linear-gradient(135deg, #FEE2E2 0%, #FECACA 100%);
  border-left: 4px solid var(--color-danger);
  border-radius: var(--radius-md);
  padding: 16px 20px;
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.15);
  transition: all var(--transition-base);
  animation: slideInDown var(--transition-base) ease;
  border: 1px solid rgba(239, 68, 68, 0.2);
}

@keyframes slideInDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.alert-banner:hover {
  box-shadow: 0 6px 16px rgba(239, 68, 68, 0.25);
  transform: translateY(-1px);
}

.alert-banner-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 8px;
}

.alert-icon {
  font-size: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
}

.alert-title {
  font-size: 14px;
  font-weight: 700;
  color: #B91C1C;
}

.alert-list {
  list-style: none;
  padding-left: 28px;
  margin: 0;
}

.alert-list li {
  font-size: 13px;
  color: #7F1D1D;
  padding: 4px 0;
  position: relative;
  line-height: 1.5;
  transition: all var(--transition-fast);
}

.alert-list li:hover {
  color: #B91C1C;
  padding-left: 4px;
}

.alert-list li::before {
  content: '•';
  position: absolute;
  left: -12px;
  font-weight: 700;
  font-size: 16px;
}
</style>
<template>
  <div class="kpi-card" :class="`kpi-${variant}`">
    <div class="kpi-label">{{ label }}</div>
    <div class="kpi-value">
      {{ value }}
      <span v-if="trend" class="kpi-trend" :class="trendClass">
        {{ trend }}
      </span>
    </div>
    <div v-if="subtitle" class="kpi-subtitle">{{ subtitle }}</div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  label: { type: String, required: true },
  value: { type: [String, Number], required: true },
  subtitle: { type: String, default: '' },
  trend: { type: String, default: '' },
  variant: { type: String, default: 'default' }
})

const trendClass = computed(() => {
  if (!props.trend) return ''
  return props.trend.includes('↑') ? 'trend-up' : 'trend-down'
})
</script>

<style scoped>
.kpi-card {
  background: white;
  border-radius: 12px;
  padding: 18px 20px;
  border: 1px solid #E2E8F0;
  transition: all var(--transition-base);
  box-shadow: var(--shadow-sm);
  cursor: default;
}

.kpi-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
  border-color: #CBD5E1;
}

.kpi-card:active {
  transform: translateY(0);
  box-shadow: var(--shadow-sm);
}

.kpi-default {
  background: white;
}

.kpi-danger {
  background: #FEE2E2;
  border-color: #FECACA;
}

.kpi-warning {
  background: #FEF3C7;
  border-color: #FDE68A;
}

.kpi-success {
  background: #DCFCE7;
  border-color: #BBF7D0;
}

.kpi-label {
  font-size: 12px;
  color: #94A3B8;
  margin-bottom: 8px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  transition: color var(--transition-base);
}

.kpi-danger .kpi-label,
.kpi-danger .kpi-value {
  color: #DC2626;
}

.kpi-warning .kpi-label,
.kpi-warning .kpi-value {
  color: #D97706;
}

.kpi-success .kpi-label,
.kpi-success .kpi-value {
  color: #16A34A;
}

.kpi-value {
  font-size: 28px;
  font-weight: 700;
  color: #1E293B;
  display: flex;
  align-items: baseline;
  gap: 8px;
  transition: color var(--transition-base);
}

.kpi-subtitle {
  font-size: 11px;
  color: #CBD5E1;
  margin-top: 4px;
  transition: color var(--transition-base);
}

.kpi-trend {
  font-size: 12px;
  font-weight: 500;
}

.trend-up {
  color: #16A34A;
}

.trend-down {
  color: #EF4444;
}
</style>
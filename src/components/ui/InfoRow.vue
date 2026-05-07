<template>
  <div class="info-row">
    <span class="info-label">{{ label }}</span>
    <span class="info-value" :class="{ 'is-highlighted': highlighted }">
      <slot>{{ value }}</slot>
    </span>
  </div>
</template>

<script setup>
defineProps({
  label: { type: String, required: true },
  value: { type: [String, Number, Boolean], default: '' },
  highlighted: { type: Boolean, default: false }
})
</script>

<style scoped>
.info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px dashed #E2E8F0;
  font-size: 13px;
  transition: all var(--transition-base);
}

.info-row:last-child {
  border-bottom: none;
}

.info-row:hover {
  background: linear-gradient(135deg, rgba(255,255,255,0), rgba(37, 99, 235, 0.02));
  padding: 10px 8px;
  margin: 0 -8px;
  border-radius: 4px;
}

.info-label {
  color: var(--color-text-secondary);
  font-weight: 500;
  transition: color var(--transition-base);
}

.info-row:hover .info-label {
  color: var(--color-text-primary);
}

.info-value {
  font-weight: 600;
  color: var(--color-text-primary);
  transition: color var(--transition-base);
}

.info-value.is-highlighted {
  color: var(--color-primary);
  font-weight: 700;
  background: rgba(37, 99, 235, 0.08);
  padding: 2px 8px;
  border-radius: 4px;
  display: inline-block;
}
</style>
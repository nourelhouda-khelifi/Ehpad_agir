<script setup>
defineProps({
  icon: {
    type: String,
    required: true
  },
  iconBg: {
    type: String,
    required: true
  },
  iconColor: {
    type: String,
    required: true
  },
  label: {
    type: String,
    required: true
  },
  value: {
    type: [Number, String],
    required: true
  }
})
</script>

<template>
  <div class="stat-card">
    <div class="icon-badge" :style="{ backgroundColor: iconBg }">
      <svg
        class="icon"
        :style="{ color: iconColor }"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
      >
        <g v-html="icon" />
      </svg>
    </div>
    <div class="content">
      <p class="label">{{ label }}</p>
      <h3 class="value">{{ value }}</h3>
    </div>
  </div>
</template>

<style scoped>
.stat-card {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  padding: 1.5rem;
  flex: 1;
  min-width: 200px;
}

.icon-badge {
  width: 56px;
  height: 56px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.icon {
  width: 28px;
  height: 28px;
}

.content {
  flex: 1;
}

.label {
  font-size: 12px;
  color: #94A3B8;
  margin: 0 0 0.25rem 0;
  font-weight: 500;
}

.value {
  font-size: 28px;
  font-weight: 700;
  color: #1E293B;
  margin: 0;
}

@media (max-width: 768px) {
  .stat-card {
    flex-direction: column;
    text-align: center;
  }

  .content {
    width: 100%;
  }
}
</style>

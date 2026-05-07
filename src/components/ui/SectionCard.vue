<template>
  <section class="section-card">
    <div v-if="title" class="section-header">
      <h2 class="section-title">
        <span v-if="icon" class="section-icon">{{ icon }}</span>
        {{ title }}
      </h2>
      <div class="section-actions">
        <slot name="actions" />
      </div>
    </div>
    <div class="section-body">
      <slot />
    </div>
  </section>
</template>

<script setup>
defineProps({
  title: { type: String, default: '' },
  icon: { type: String, default: '' }
})
</script>

<style scoped>
.section-card {
  background: white;
  border-radius: 12px;
  border: 1px solid #E2E8F0;
  overflow: hidden;
  box-shadow: var(--shadow-sm);
  transition: box-shadow var(--transition-base), border-color var(--transition-base);
}

.section-card:hover {
  box-shadow: var(--shadow-md);
  border-color: #CBD5E1;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #E2E8F0;
  background: linear-gradient(135deg, #FFFFFF 0%, #F8FAFC 100%);
}

.section-title {
  font-size: 15px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
  color: #1E293B;
}

.section-icon {
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.section-body {
  padding: 16px 20px;
}
</style>
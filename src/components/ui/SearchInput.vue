<template>
  <div class="search-input">
    <span class="search-icon">🔍</span>
    <input
      type="text"
      :value="modelValue"
      :placeholder="placeholder"
      @input="$emit('update:modelValue', $event.target.value)"
    />
    <button
      v-if="modelValue"
      class="clear-btn"
      @click="$emit('update:modelValue', '')"
    >
      ✕
    </button>
  </div>
</template>

<script setup>
defineProps({
  modelValue: { type: String, default: '' },
  placeholder: { type: String, default: 'Rechercher...' }
})

defineEmits(['update:modelValue'])
</script>

<style scoped>
.search-input {
  position: relative;
  display: flex;
  align-items: center;
  background: white;
  border: 1.5px solid #E2E8F0;
  border-radius: 8px;
  padding: 0 12px;
  transition: all var(--transition-base);
  height: 40px;
  box-shadow: var(--shadow-xs);
}

.search-input:hover {
  border-color: #CBD5E1;
  box-shadow: var(--shadow-sm);
}

.search-input:focus-within {
  border-color: #2563EB;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1), var(--shadow-md);
  background: #F0F9FF;
}

.search-icon {
  font-size: 16px;
  margin-right: 10px;
  transition: transform var(--transition-fast);
}

.search-input:focus-within .search-icon {
  transform: scale(1.1);
}

.search-input input {
  flex: 1;
  border: none;
  outline: none;
  padding: 0;
  font-size: 13px;
  background: transparent;
  color: #1E293B;
  font-weight: 500;
}

.search-input input::placeholder {
  color: #94A3B8;
  font-weight: 400;
  transition: color var(--transition-base);
}

.search-input:focus-within input::placeholder {
  color: #CBD5E1;
}

.clear-btn {
  font-size: 13px;
  color: #94A3B8;
  padding: 6px 8px;
  border-radius: 4px;
  border: none;
  background: transparent;
  cursor: pointer;
  transition: all var(--transition-fast);
  font-weight: 600;
  animation: fadeIn var(--transition-fast) ease;
}

.clear-btn:hover {
  background: #F1F5F9;
  color: #1E293B;
  transform: scale(1.1);
}

.clear-btn:active {
  transform: scale(0.95);
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.8);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
</style>
<script setup>
import { ref } from 'vue'

const searchQuery = ref('')
</script>

<template>
  <div class="search-bar">
    <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.35-4.35" />
    </svg>
    <input
      v-model="searchQuery"
      type="text"
      placeholder="chercher..."
      class="search-input"
    />
    <button class="filter-btn">
      <svg class="filter-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
      </svg>
    </button>
  </div>
</template>

<style scoped>
.search-bar {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 2rem;
  position: relative;
  width: 100%;
}

.search-icon {
  position: absolute;
  left: 1.25rem;
  width: 18px;
  height: 18px;
  color: #94A3B8;
  flex-shrink: 0;
  z-index: 2;
}

.search-input {
  flex: 1;
  padding: 0.75rem 1rem 0.75rem 2.75rem;
  border: 1px solid #E2E8F0;
  border-radius: 12px;
  font-size: 14px;
  background: #FFFFFF;
  color: #1E293B;
  transition: all 0.2s ease;
  width: 100%;
  height: 44px;
}

.search-input::placeholder {
  color: #CBD5E1;
}

.search-input:focus {
  outline: none;
  border-color: #2563EB;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

.filter-btn {
  padding: 0.625rem 0.75rem;
  border: 1px solid #E2E8F0;
  background: transparent;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.filter-icon {
  width: 20px;
  height: 20px;
  color: #94A3B8;
}

.filter-btn:hover {
  background: #F8FAFC;
  border-color: #CBD5E1;
}

.filter-btn:hover .filter-icon {
  color: #64748B;
}
</style>

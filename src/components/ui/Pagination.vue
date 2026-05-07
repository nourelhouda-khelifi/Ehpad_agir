<template>
  <div class="pagination">
    <div class="pagination-info">
      Affichage de {{ start }}-{{ end }} sur {{ total }} patients
    </div>
    <div class="pagination-controls">
      <button
        class="page-btn"
        :disabled="currentPage === 1"
        @click="$emit('change', currentPage - 1)"
      >
        ‹
      </button>

      <button
        v-for="page in visiblePages"
        :key="page"
        class="page-btn"
        :class="{ 'is-active': page === currentPage }"
        @click="$emit('change', page)"
      >
        {{ page }}
      </button>

      <button
        class="page-btn"
        :disabled="currentPage === totalPages"
        @click="$emit('change', currentPage + 1)"
      >
        ›
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  currentPage: { type: Number, required: true },
  totalPages: { type: Number, required: true },
  pageSize: { type: Number, required: true },
  total: { type: Number, required: true }
})

defineEmits(['change'])

const start = computed(() => (props.currentPage - 1) * props.pageSize + 1)
const end = computed(() => Math.min(props.currentPage * props.pageSize, props.total))

const visiblePages = computed(() => {
  const pages = []
  const max = Math.min(props.totalPages, 5)
  let startPage = Math.max(1, props.currentPage - 2)
  const endPage = Math.min(props.totalPages, startPage + max - 1)
  startPage = Math.max(1, endPage - max + 1)

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i)
  }
  return pages
})
</script>

<style scoped>
.pagination {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 0;
  border-top: 1px solid #E2E8F0;
  margin-top: 16px;
}

.pagination-info {
  font-size: 13px;
  color: #94A3B8;
  font-weight: 500;
}

.pagination-controls {
  display: flex;
  gap: 6px;
}

.page-btn {
  min-width: 36px;
  height: 36px;
  padding: 0 8px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 600;
  background: white;
  border: 1.5px solid #E2E8F0;
  color: #64748B;
  transition: all var(--transition-base);
  cursor: pointer;
  box-shadow: var(--shadow-xs);
}

.page-btn:hover:not(:disabled) {
  border-color: #2563EB;
  color: #2563EB;
  background: #F0F9FF;
  box-shadow: var(--shadow-sm);
  transform: translateY(-1px);
}

.page-btn.is-active {
  background: #2563EB;
  color: white;
  border-color: #1D4ED8;
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
  font-weight: 700;
}

.page-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  background: #F1F5F9;
  box-shadow: none;
}

.page-btn:active:not(:disabled) {
  transform: translateY(0);
}
</style>
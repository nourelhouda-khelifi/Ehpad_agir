<template>
  <div class="historique">
    <div v-if="items.length === 0" class="empty-state">
      <span class="empty-icon">📋</span>
      <p>Aucun historique disponible</p>
    </div>
    <div v-else class="historique-list">
      <div
        v-for="(item, i) in items"
        :key="i"
        class="historique-item"
      >
        <div class="historique-dot" :class="`dot-${item.statut}`"></div>
        <div class="historique-content">
          <div class="historique-title">{{ formatTitle(item) }}</div>
          <div class="historique-date">{{ formatDate(item.date) }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  items: { type: Array, required: true }
})

const formatTitle = (item) => {
  if (item.type === 'douche') return `Douche effectuée par ${item.as}`
  if (item.type === 'toilette') return `Toilette par ${item.as}`
  if (item.type === 'note') return `Note ajoutée : "${item.contenu}"`
  return item.type
}

const formatDate = (date) => {
  const d = new Date(date)
  return d.toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script>

<style scoped>
.historique-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.historique-item {
  display: flex;
  gap: 12px;
  align-items: flex-start;
  padding: 12px 14px;
  border-radius: var(--radius-md);
  transition: all var(--transition-base);
  border-left: 3px solid transparent;
  box-shadow: var(--shadow-xs);
  background: #F8FAFC;
}

.historique-item:hover {
  background: #EFF6FF;
  box-shadow: var(--shadow-sm);
  transform: translateX(4px);
  border-left-color: var(--color-primary);
}

.historique-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  margin-top: 4px;
  flex-shrink: 0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: all var(--transition-fast);
}

.historique-item:hover .historique-dot {
  transform: scale(1.2);
}

.dot-effectue {
  background: linear-gradient(135deg, #1D9E75 0%, #10B981 100%);
}

.dot-note {
  background: linear-gradient(135deg, #D97706 0%, #F59E0B 100%);
}

.dot-manque {
  background: linear-gradient(135deg, #DC2626 0%, #EF4444 100%);
}

.historique-content {
  flex: 1;
}

.historique-title {
  font-size: 13px;
  font-weight: 600;
  color: var(--color-text-primary);
  margin-bottom: 4px;
}

.historique-date {
  font-size: 11px;
  color: var(--color-text-tertiary);
  text-transform: capitalize;
}

.empty-state {
  text-align: center;
  padding: 30px 20px;
  color: var(--color-text-tertiary);
}

.empty-icon {
  font-size: 28px;
  display: block;
  margin-bottom: 8px;
}

.empty-state p {
  font-size: 13px;
}
</style>
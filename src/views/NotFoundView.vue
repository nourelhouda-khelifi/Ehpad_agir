<template>
  <div class="not-found">
    <span class="not-found-code">404</span>
    <h1>Page introuvable</h1>
    <p>Cette page n'existe pas ou a été déplacée.</p>
    <router-link to="/dashboard" class="btn-back">← Retour au dashboard</router-link>
  </div>
</template>

<style scoped>
.not-found {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  gap: 12px;
  text-align: center;
  color: var(--color-text-secondary, #6B7280);
}

.not-found-code {
  font-size: 72px;
  font-weight: 800;
  color: var(--color-primary, #3B82F6);
  line-height: 1;
}

.not-found h1 {
  font-size: 22px;
  font-weight: 600;
  color: var(--color-text-primary, #111827);
  margin: 0;
}

.not-found p {
  margin: 0;
  font-size: 14px;
}

.btn-back {
  margin-top: 8px;
  padding: 8px 20px;
  background: var(--color-primary, #3B82F6);
  color: white;
  border-radius: 8px;
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
}

.btn-back:hover {
  opacity: 0.9;
}
</style>

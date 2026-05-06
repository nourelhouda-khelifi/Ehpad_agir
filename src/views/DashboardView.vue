<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const handleLogout = () => {
  router.push('/login')
}
</script>

<template>
  <div class="dashboard-container">
    <div class="dashboard-header">
      <h1>Dashboard</h1>
      <button @click="handleLogout" class="logout-button">Déconnexion</button>
    </div>
    <div class="dashboard-content">
      <p>Bienvenue sur le dashboard ! 👋</p>
    </div>
  </div>
</template>

<style scoped>
.dashboard-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #1f5fa8 0%, #2a5caa 100%);
  padding: 2rem;
  color: white;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid rgba(255, 255, 255, 0.2);
}

.dashboard-header h1 {
  font-size: 32px;
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
}

.logout-button {
  padding: 10px 24px;
  border: none;
  border-radius: 25px;
  font-size: 14px;
  font-weight: 600;
  background-color: #ffffff;
  color: #1f5fa8;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: inherit;
}

.logout-button:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.logout-button:active {
  transform: scale(0.98);
}

.dashboard-content {
  background: rgba(255, 255, 255, 0.1);
  padding: 2rem;
  border-radius: 12px;
  backdrop-filter: blur(10px);
}

.dashboard-content p {
  font-size: 18px;
  margin: 0;
}

@media (max-width: 768px) {
  .dashboard-header {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }

  .dashboard-header h1 {
    font-size: 24px;
  }

  .logout-button {
    align-self: flex-end;
  }
}
</style>

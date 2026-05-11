<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

defineProps({
  isOpen: {
    type: Boolean,
    default: false
  }
})

defineEmits(['close'])

const menuItems = [
  { name: 'dashboard', path: '/dashboard', label: 'Dashboard', icon: 'dashboard' },
  { name: 'patients', path: '/patients', label: 'Patients', icon: 'patients' },
  { name: 'planning-activites', path: '/planning/douches', label: 'Activités', badge: 3, icon: 'douches' },
  { name: 'planning-daily', path: '/planning/quotidien', label: 'Planning jour', icon: 'planning' },
  { name: 'aides-soignants', path: '/aides-soignants', label: 'Équipe AS', icon: 'team' }
]

const icons = {
  dashboard: '<rect x="3" y="3" width="18" height="18" rx="6" /><circle cx="12" cy="12" r="5" />',
  patients: '<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />',
  douches: '<path d="M4 4h16v1H4zM6 6v10a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V6M9 10h6" />',
  planning: '<rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" />',
  team: '<path d="M17 21v-2a4 4 0 0 0-5-3.87M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" /><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />'
}

const handleLogout = () => {
  router.push('/login')
}

const handleNavigation = () => {
  // Fermer la sidebar sur mobile après navigation
  if (window.innerWidth <= 1024) {
    this.$emit('close')
  }
}
</script>

<template>
  <aside class="sidebar" :class="{ 'sidebar-open': isOpen }">
    <!-- User Info Section -->
    <div class="sidebar-header">
      <div class="user-info">
        <img src="../assets/user.jpg" alt="User Avatar" class="user-avatar" />
        <div class="user-details">
          <div class="user-name">Foulen Ben</div>
          <div class="user-role">Infirmière</div>
        </div>
      </div>
    </div>

    <!-- Navigation Menu -->
    <nav class="sidebar-nav">
      <router-link
        v-for="item in menuItems"
        :key="item.name"
        :to="item.path"
        class="nav-item"
        active-class="nav-item-active"
        @click="$emit('close')"
      >
        <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <g v-html="icons[item.icon]" />
        </svg>
        <span class="nav-label">{{ item.label }}</span>
        <span v-if="item.badge" class="nav-badge">{{ item.badge }}</span>
      </router-link>
    </nav>

    <!-- Footer -->
    <div class="sidebar-footer">
      <img src="../assets/logoagir .png" alt="Agir Logo" class="footer-logo" />
      <button class="logout-btn" @click="handleLogout">
        <svg class="logout-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
        Déconnexion
      </button>
    </div>
  </aside>
</template>

<style scoped>
.sidebar {
  width: 228px;
  background: linear-gradient(180deg, #FFFFFF 0%, #F8FAFC 100%);
  box-shadow: 2px 0 12px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow-y: auto;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 100;
  transition: all var(--transition-base);
}

/* Header - User Info */
.sidebar-header {
  padding: 1.5rem;
  border-bottom: 1px solid #E2E8F0;
  text-align: center;
  background: linear-gradient(135deg, rgba(37, 99, 235, 0.05) 0%, rgba(37, 99, 235, 0.02) 100%);
}

.user-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
}

.user-avatar {
  width: 90px;
  height: 90px;
  border-radius: 50%;
  border: 3px solid #2563EB;
  object-fit: cover;
  flex-shrink: 0;
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
  transition: all var(--transition-base);
}

.user-avatar:hover {
  transform: scale(1.05);
  box-shadow: 0 6px 16px rgba(37, 99, 235, 0.4);
}

.user-details {
  text-align: center;
}

.user-name {
  font-size: 15px;
  font-weight: 700;
  color: #1E293B;
  margin: 0 0 0.25rem 0;
}

.user-role {
  font-size: 13px;
  color: #2563EB;
  margin: 0;
  font-weight: 500;
}

/* Navigation */
.sidebar-nav {
  flex: 1;
  padding: 1rem 0.75rem;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  color: #94A3B8;
  font-size: 14px;
  font-weight: 500;
  transition: all var(--transition-base);
  position: relative;
  text-decoration: none;
  cursor: pointer;
  box-shadow: var(--shadow-xs);
}

.nav-item:hover {
  background: linear-gradient(135deg, #F1F5F9 0%, #E2E8F0 100%);
  color: #64748B;
  box-shadow: var(--shadow-sm);
  transform: translateX(2px);
}

.nav-item-active {
  background: linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%);
  color: white;
  font-weight: 600;
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
}

.nav-item-active::before {
  content: '';
  position: absolute;
  left: 0;
  top: 6px;
  bottom: 6px;
  width: 3px;
  background: white;
  border-radius: 0 3px 3px 0;
  animation: slideInLeft var(--transition-fast) ease;
}

@keyframes slideInLeft {
  from {
    width: 0;
  }
  to {
    width: 3px;
  }
}

.nav-icon {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
  transition: transform var(--transition-base);
}

.nav-item-active .nav-icon {
  transform: scale(1.1);
}

.nav-label {
  flex: 1;
}

.nav-badge {
  background: #EF4444;
  color: white;
  font-size: 11px;
  font-weight: 600;
  padding: 2px 6px;
  border-radius: 999px;
  min-width: 20px;
  text-align: center;
  flex-shrink: 0;
  box-shadow: 0 2px 4px rgba(239, 68, 68, 0.3);
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% {
    box-shadow: 0 2px 4px rgba(239, 68, 68, 0.3);
  }
  50% {
    box-shadow: 0 2px 8px rgba(239, 68, 68, 0.5);
  }
}

/* Footer */
.sidebar-footer {
  padding: 1.5rem;
  border-top: 1px solid #E2E8F0;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  background: linear-gradient(135deg, rgba(255,255,255,0.5) 0%, rgba(248,250,252,0.5) 100%);
}

.footer-logo {
  max-width: 100px;
  height: auto;
  display: block;
  margin: 0 auto;
  opacity: 0.8;
  transition: opacity var(--transition-base);
}

.footer-logo:hover {
  opacity: 1;
}

.logout-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  border: 1.5px solid #FEE2E2;
  background: transparent;
  color: #EF4444;
  cursor: pointer;
  font-size: 13px;
  font-weight: 600;
  transition: all var(--transition-base);
  border-radius: 8px;
  box-shadow: var(--shadow-xs);
}

.logout-btn:hover {
  background: linear-gradient(135deg, #FEE2E2 0%, #FECACA 100%);
  color: #DC2626;
  border-color: #FECACA;
  box-shadow: var(--shadow-sm);
  transform: translateY(-1px);
}

.logout-btn:active {
  transform: translateY(0);
}

.logout-icon {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
}

@media (max-width: 1024px) {
  .sidebar {
    position: fixed;
    left: 0;
    top: 0;
    width: 228px;
    height: 100vh;
    z-index: 100;
    transform: translateX(-100%);
    box-shadow: -2px 0 12px rgba(0, 0, 0, 0.15);
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .sidebar.sidebar-open {
    transform: translateX(0);
  }
}

@media (max-width: 768px) {
  .sidebar {
    width: 240px;
  }

  .sidebar-header {
    padding: 1.25rem;
  }

  .user-avatar {
    width: 75px;
    height: 75px;
  }

  .user-name {
    font-size: 14px;
  }

  .user-role {
    font-size: 12px;
  }
}

@media (max-width: 480px) {
  .sidebar {
    width: 100%;
    max-width: 280px;
  }

  .sidebar-header {
    padding: 1rem;
  }

  .user-avatar {
    width: 64px;
    height: 64px;
  }

  .user-name {
    font-size: 13px;
  }

  .sidebar-nav {
    padding: 0.75rem 0.5rem;
  }

  .nav-item {
    padding: 0.65rem 0.8rem;
    font-size: 13px;
  }

  .nav-icon {
    width: 18px;
    height: 18px;
  }

  .nav-label {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .sidebar-footer {
    padding: 1rem;
  }
}
</style>

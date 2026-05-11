<script setup>
import { useRouter } from 'vue-router'
import { ref } from 'vue'
import Sidebar from '@/components/Sidebar.vue'

const router = useRouter()
const sidebarOpen = ref(false)

const isLoginPage = () => {
  return router.currentRoute.value.path === '/login'
}

const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value
}

const closeSidebar = () => {
  sidebarOpen.value = false
}
</script>

<template>
  <div id="app">
    <template v-if="!isLoginPage()">
      <!-- Overlay for mobile sidebar -->
      <div
        v-if="sidebarOpen"
        class="sidebar-overlay"
        @click="closeSidebar"
      ></div>

      <!-- Sidebar -->
      <Sidebar :is-open="sidebarOpen" @close="closeSidebar" />

      <!-- Main layout -->
      <main class="main-layout">
        <!-- Hamburger button for mobile -->
        <button
          class="hamburger-btn"
          @click="toggleSidebar"
          :aria-label="sidebarOpen ? 'Fermer menu' : 'Ouvrir menu'"
        >
          <svg v-if="!sidebarOpen" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M3 6h18M3 12h18M3 18h18" />
          </svg>
          <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>

        <div class="main-wrapper">
          <router-view />
        </div>
      </main>
    </template>
    <template v-else>
      <router-view />
    </template>
  </div>
</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body, #app {
  height: 100%;
  width: 100%;
}

body {
  background: linear-gradient(135deg, #FAFBFF 0%, #F0F4FF 100%);
  margin: 0;
  font-family: 'Segoe UI', 'Roboto', sans-serif;
  color: #1E293B;
}

#app {
  display: flex;
}

.main-layout {
  flex: 1;
  margin-left: 228px;
  overflow-y: auto;
  background: linear-gradient(135deg, #FAFBFF 0%, #F0F4FF 100%);
  height: 100vh;
  transition: all var(--transition-base);
  position: relative;
}

.main-wrapper {
  width: 100%;
  min-height: 100%;
  padding: 0;
}

@media (max-width: 1024px) {
  .main-wrapper {
    padding-top: 70px;
  }
}

@media (max-width: 480px) {
  .main-wrapper {
    padding-top: 60px;
  }
}

/* Hamburger Button */
.hamburger-btn {
  display: none;
  position: fixed;
  top: 20px;
  left: 20px;
  width: 44px;
  height: 44px;
  background: white;
  border: 1px solid #E2E8F0;
  border-radius: 8px;
  cursor: pointer;
  z-index: 101;
  align-items: center;
  justify-content: center;
  color: #1E293B;
  transition: all var(--transition-base);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.hamburger-btn:hover {
  background: #F8FAFC;
  border-color: #CBD5E1;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
}

.hamburger-btn svg {
  width: 24px;
  height: 24px;
}

/* Sidebar Overlay */
.sidebar-overlay {
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 99;
  animation: fadeIn 0.2s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* Scrollbar styling */
.main-layout::-webkit-scrollbar {
  width: 8px;
}

.main-layout::-webkit-scrollbar-track {
  background: transparent;
}

.main-layout::-webkit-scrollbar-thumb {
  background: #CBD5E1;
  border-radius: 4px;
  transition: background var(--transition-base);
}

.main-layout::-webkit-scrollbar-thumb:hover {
  background: #94A3B8;
}

/* Tablet: 768px and below */
@media (max-width: 1024px) {
  .main-layout {
    margin-left: 0;
  }

  .hamburger-btn {
    display: flex;
  }

  .sidebar-overlay {
    display: block;
  }
}

/* Small Mobile: 480px and below */
@media (max-width: 480px) {
  .hamburger-btn {
    top: 16px;
    left: 16px;
    width: 40px;
    height: 40px;
  }

  .hamburger-btn svg {
    width: 20px;
    height: 20px;
  }
}
</style>


<script setup>
import { useRouter } from 'vue-router'
import Sidebar from '@/components/Sidebar.vue'

const router = useRouter()

const isLoginPage = () => {
  return router.currentRoute.value.path === '/login'
}
</script>

<template>
  <div id="app">
    <template v-if="!isLoginPage()">
      <Sidebar />
      <main class="main-layout">
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
}

.main-wrapper {
  width: 100%;
  min-height: 100%;
  padding: 0;
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

@media (max-width: 768px) {
  .main-layout {
    margin-left: 0;
  }
}
</style>


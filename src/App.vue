<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()
</script>

<template>
  <router-view />
</template>

<style>
html, body {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
}

#app {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  min-height: 100vh;
}
</style>

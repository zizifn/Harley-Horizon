<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <nav>
    <RouterLink to="/">Home</RouterLink>
    <RouterLink to="/accessibility">accessibility</RouterLink>
  </nav>

  <router-view />
</template>

<style lang="scss">
@use './assets/style/common.scss';
</style>
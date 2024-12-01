<template>
  <div class="edge">
      <MainArea />
      <SideBar />
  </div>
</template>

<script setup>
  import SideBar from '../components/home/profile.vue';
  import MainArea from '../components/home/main.vue'
</script>

<style lang="scss" scoped>
  .edge {
    max-width: 1920px;
    min-width: 375px;
    max-height: 1080px;
    display: flex;
    overflow: hidden;
    width: 100vw;
    height: 100vh;
    border-radius: 0.5rem;
    box-shadow: 0 1px 6px #a8a9ad;
  }
</style>

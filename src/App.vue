<template>
  <div class="app-container">
    <TheHeader />
    <div class="content-container">
      <router-view />
    </div>
    <TheFooter />
  </div>
</template>

<script setup>
import TheHeader from "./views/TheHeader.vue";
import TheFooter from "./views/TheFooter.vue";
</script>

<style scoped>
.app-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.content-container {
  flex-grow: 1;
}

/* Other styles for header and footer */
</style>

<template>
    <TheHeader />
    <div class="content-container">
    <router-view /> <!-- This will display the appropriate component based on the current route -->
    </div>
    <TheFooter />
</template>

<script setup>
import TheHeader from "./views/TheHeader.vue";
import TheFooter from "./views/TheFooter.vue";
</script>

<style scoped>

</style>

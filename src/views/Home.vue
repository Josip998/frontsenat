<template>
  <div class="home-container">
    <login-form @login="login"></login-form>
  </div>
</template>

<script>
import LoginForm from "../components/LoginForm.vue"; // Adjust the import path as needed
import VueCookies from "vue-cookies";
export default {
  components: {
    "login-form": LoginForm,
  },
  methods: {
    login(data) {
      // Implement your login logic here
      // You can also redirect to a different route on successful login.
      console.log("Received login data:", data);
      const token = VueCookies.get("setToken");
      console.log("Retrieved token from cookie:", token);
    },
  },
};
</script>

<style scoped>
.home-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}
</style>

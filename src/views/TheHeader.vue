<template>
  <header class="app-header">
    <div class="logo">
      <img src="/src/assets/images/logo.png" alt="Your Logo" />
    </div>
    <nav class="nav-menu">
      <!-- Conditional rendering based on authentication status -->
      <router-link  to="/login"
        ><button class="button" v-if="!isAuthenticated">PRIJAVA</button></router-link
      >
      <button class="button" @click="logoutUser" v-if="isAuthenticated">ODJAVA</button>
      <router-link to="/"
        ><button class="button" v-if="!isAuthenticated">SJEDNICE</button></router-link
      >
      <router-link to="/meetings"
        ><button class="button" v-if="isAuthenticated">SJEDNICE</button></router-link
      >
      
      <!-- End of conditional rendering -->
    </nav>
  </header>
</template>

<script>
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import axios from "axios"; // Import Axios

export default {
  setup() {
    const store = useStore();
    const router = useRouter();

    const isAuthenticated = store.getters.isAuthenticated;

    const logoutUser = () => {
      // Make a POST request to your backend to log out the user
      axios
        .post("/api/logout") // Adjust the URL as needed
        .then((response) => {
          if (response.status === 200) {
            // Dispatch the logout action to clear user data and authentication status
            store.dispatch("logout");
            // Check if the user is now logged out
            if (!isAuthenticated.value) {
              // Handle the case where the user is logged out
              console.log("User is logged out");
            }
            router.afterEach(() => {
              // Refresh the page after the route is fully navigated
              window.location.reload();
            });
            // Redirect to the home page or login page after logout
            router.push("/"); // You can change this route as needed
          } else {
            console.error("Logout failed");
          }
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    };

    return {
      logoutUser,
      isAuthenticated,
    };
  },
};
</script>

<style scoped>
.app-header {
  background-color: #d1d2d7;
  color: #fff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
}

img {
  width: 200px;
  height: 100px;
}

.nav-menu a {
  color: #0b51f5;
  text-decoration: none !important; /* Add !important to enforce the rule */
  margin: 0 10px;
}

.button {
  color: #0b51f5;
  padding: 10px 20px;
  border: 2px solid #0b51f5;
  border-radius: 5px;
  background: transparent;
  transition: transform 0.3s, background-color 0.3s, color 0.3s;
  cursor: pointer;
  font-weight: bold;
}

.button:hover {
  transform: scale(1.05);
  background-color: #0b51f5;
  color: #fff;
  box-shadow: 0 0 10px rgba(11, 81, 245, 0.5);
}
</style>

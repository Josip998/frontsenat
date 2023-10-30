<template lang="pug">
.container(onclick)
  .top
  .bottom
  .center
    h2 Prijava
    input(type="text" placeholder="Korisničko ime" v-model="username")
    input(type="password" placeholder="Lozinka" v-model="password" @keyup.enter="loginUser")
    div.button-container
      button(type="button" class="login-button" @click="loginUser") Prijava
      router-link(to="/")
        button(type="button" class="guest-button") Gost
</template>

<script>
import { ref } from "vue";
import axios from "axios";
import { useStore } from "vuex";
import { useRouter } from "vue-router"; // Import the router functions

export default {
  setup() {
    const store = useStore();
    const router = useRouter(); // Use router for navigation
    const username = ref("");
    const password = ref("");

    const loginUser = () => {
      // Prepare the login data
      const loginData = {
        username: username.value,
        password: password.value,
      };

      // Make a POST request using Axios
      axios
        .post("/api/login", loginData)
        .then((response) => {
          if (response.status === 200) {
            console.log("Logged In");
            const { user, access_token: token } = response.data;
            store.dispatch("login", { user, token });
            console.log("Response Data:", response.data); // Log the response data
            // Log the user and token after dispatching
            console.log("User in Store:", store.state.user);
            console.log("Token in Store:", store.state.token);
            // Use Vue Router's afterEach navigation guard to refresh the page after route change
            router.afterEach(() => {
              // Refresh the page after the route is fully navigated
              window.location.reload();
            });
            // Redirect using router
            router.push("/meetings");
          } else {
            // Handle login failure (e.g., display an error message)
            console.error("Login failed");
          }
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    };

    return {
      username,
      password,
      loginUser,
    };
  },
};
</script>

<style scoped lang="scss">
*,
*:before,
*:after {
  box-sizing: border-box;
}

body {
  min-height: 100vh;
}

h2 {
  font-family: "Lucida Sans", "Lucida Sans Regular", "Lucida Grande",
    "Lucida Sans Unicode", Geneva, Verdana, sans-serif;
}

.container {
  position: absolute;
  width: 100%;
  height: 100%;
  overflow: hidden;

  &:hover,
  &:active {
    .top,
    .bottom {
      &:before,
      &:after {
        margin-left: 200px;
        transform-origin: -200px 50%;
        transition-delay: 0s;
      }
    }

    .center {
      opacity: 1;
      transition-delay: 0.2s;
    }
  }
}

.top,
.bottom {
  &:before,
  &:after {
    content: "";
    display: block;
    position: absolute;
    width: 200vmax;
    height: 200vmax;
    top: 50%;
    left: 50%;
    margin-top: -100vmax;
    transform-origin: 0 50%;
    transition: all 0.5s cubic-bezier(0.445, 0.05, 0, 1);
    z-index: 10;
    opacity: 0.65;
    transition-delay: 0.2s;
  }
}

.top {
  &:before {
    transform: rotate(45deg);
    background: #e46569;
  }
  &:after {
    transform: rotate(135deg);
    background: #ecaf81;
  }
}

.bottom {
  &:before {
    transform: rotate(-45deg);
    background: #60b8d4;
  }
  &:after {
    transform: rotate(-135deg);
    background: #3745b5;
  }
}

.center {
  position: absolute;
  width: 400px;
  height: 400px;
  top: 50%;
  left: 50%;
  margin-left: -200px;
  margin-top: -200px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 30px;
  opacity: 0;
  transition: all 0.5s cubic-bezier(0.445, 0.05, 0, 1);
  transition-delay: 0s;
  color: #ffffff;

  input {
    width: 100%;
    padding: 15px;
    margin: 5px;
    border-radius: 1px;
    border: 1px solid #ccc;
    font-family: inherit;
  }

  .button-container {
    display: flex;
    gap: 10px;
  }

  .guest-button,
  .login-button {
    width: 100%;
    padding: 10px 30px;

    border-radius: 5px;
    border: 1px solid #ccc;
    font-family: inherit;
    cursor: pointer;
    transition: background-color 0.3s ease-in-out, color 0.3s ease-in-out;
  }

  .guest-button {
    background-color: #007bff;
    color: #fff;

    &:hover {
      background-color: #0056b3;
    }
  }

  .login-button {
    background-color: #4caf50;
    color: #fff;

    &:hover {
      background-color: #45a049;
    }
  }
}
</style>

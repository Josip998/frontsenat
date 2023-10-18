<template>
  <header class="app-header">
    <div class="logo">
      <img src="/src/assets/images/logo.png" alt="Your Logo" />
    </div>
    <nav class="nav-menu">
      <router-link to="/"><strong class="button">LOGIN</strong></router-link>
      <router-link to="/guest-meetings"><strong class="button">MEETINGS</strong></router-link>
    </nav>
  </header>
</template>

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




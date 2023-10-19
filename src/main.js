import { createApp } from 'vue';
import './style.css';
import router from '/src/router/router.js';
import store from '/store/store.js'; // Import your Vuex store
import App from './App.vue';
import axios from 'axios';
import VueCookies from 'vue-cookies';


const token = VueCookies.get('setToken');
if (token) {
  store.dispatch('login', { user: null, token }); // Load user data if available
}

// Set the base URL for your Laravel backend
axios.defaults.baseURL = 'http://localhost:8000';

createApp(App)
  .use(router)
  .use(store)
  .use(VueCookies)
  .mount('#app');


  

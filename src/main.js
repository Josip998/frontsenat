import { createApp } from 'vue'
import './style.css'
import router from './router/router'
import App from './App.vue';
import axios from 'axios';

// Set the base URL for your Laravel backend
axios.defaults.baseURL = 'http://localhost:8000';

createApp(App).use(router).mount('#app');
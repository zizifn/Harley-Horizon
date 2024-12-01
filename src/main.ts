import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'

const app = createApp(App);
app.use(createPinia()).use(router).mount('#app');
app.config.compilerOptions.isCustomElement = tag => tag.startsWith('harley-');
//app.config.compilerOptions.isCustomElement = tag => tag ==='harley-calendar';

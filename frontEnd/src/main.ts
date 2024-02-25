import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import { createPinia } from 'pinia'
import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import './index.css'
import { routes } from './router'

const pinia = createPinia()
const router = createRouter({
  history: createWebHistory(),
  routes: routes,
})

const app = createApp(App)
app.use(pinia)
app.use(ElementPlus)
app.use(router)
app.mount('#app')

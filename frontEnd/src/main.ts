import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import { createPinia } from 'pinia'
import { createApp } from 'vue'
import App from './App.vue'
import './index.css'
import { router } from './router'
import { useKeepAliveStore } from './store/keepActiveStore'
import { useStationStore } from './store/stationStore'

const pinia = createPinia()

const app = createApp(App)
app.use(pinia)
app.use(ElementPlus)
app.use(router)
app.mount('#app')

const keepAliveStore = useKeepAliveStore()
const stationStore = useStationStore()
router.beforeEach((to, from) => {
  if (from.meta.index !== to.meta.index) {
    keepAliveStore.clearKeepAliveComponent()
    stationStore.reset()
  }
  keepAliveStore.addKeepAliveComponent(to.name as string)
})

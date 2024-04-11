import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    proxy: {
      '/api': {
        target: 'http://172.21.212.165:9989/api',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
      '/testapi':{
        target: 'https://172.21.213.47:3001/forecastRouter/',
        changeOrigin: true,
        secure:false,
        rewrite: (path) => path.replace(/^\/testapi/, ''),
      }
    },
  },
})

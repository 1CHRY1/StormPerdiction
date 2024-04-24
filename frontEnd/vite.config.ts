import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:9989/api',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
      '/field':{
        target: 'http://localhost:9989/api/v1/data/nc/field',
        changeOrigin: true,
        secure:false,
        rewrite: (path) => path.replace(/^\/testapi/, ''),
      }
    },
  },
})

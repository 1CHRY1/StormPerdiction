import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
// import basicSsl from '@vitejs/plugin-basic-ssl'

// https://vitejs.dev/config/
export default defineConfig({
  // plugins: [vue(), basicSsl()],
  plugins: [vue()],
  server: {
    host: '0.0.0.0',
    proxy: {
      '/api': {
        target: 'http://172.21.212.166:9989/api',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
      '/field': {
        target: 'http://172.21.212.166:9989/api/v1/data/nc/field',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/field/, ''),
      },
    },
  },
})

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  base: './',
  define: {
    'process.env': {
      'BASE_URL' : '.'
    }
  },
  plugins: [vue()],
})

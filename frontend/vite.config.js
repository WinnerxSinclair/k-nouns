import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@zod': path.resolve(__dirname, '../shared/zodSchemas'),
      '@zodConsts': path.resolve(__dirname, '../shared/constants/zod')
    }
  },
  build: {
    minifiy: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    }
  },
  esbuild: {
    supported:{
      'top-level-await': true
    }
  }
})

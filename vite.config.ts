import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

const REPO_NAME = 'generator_task_trext'

export default defineConfig({
  plugins: [vue()],
  base: process.env.NODE_ENV === 'production' ? `/${REPO_NAME}/` : '/',
})

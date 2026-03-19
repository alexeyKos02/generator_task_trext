import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// Замените 'generator-task-trext' на имя вашего репозитория GitHub
const REPO_NAME = 'generator-task-trext'

export default defineConfig({
  plugins: [vue()],
  base: process.env.NODE_ENV === 'production' ? `/${REPO_NAME}/` : '/',
})

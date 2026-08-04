import process from 'node:process'
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

function requiredEnv(env, key) {
  const value = env[key]

  if (!value) {
    throw new Error(`Missing ${key}. Please set it in task-list-fe/.env`)
  }

  return value
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const apiProxyTarget = requiredEnv(env, 'VITE_API_PROXY_TARGET')

  return {
    plugins: [react()],
    server: {
      proxy: {
        '/api': {
          target: apiProxyTarget,
          changeOrigin: true,
        },
      },
    },
  }
})

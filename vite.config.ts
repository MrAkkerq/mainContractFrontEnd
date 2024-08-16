import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { nodePolyfills } from 'vite-plugin-node-polyfills'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), nodePolyfills({
    globals: {
      // Don't polyfill these globals
      process: false,
      Buffer: false,
    },
  })],
  base: '/counter-front-end/',
})

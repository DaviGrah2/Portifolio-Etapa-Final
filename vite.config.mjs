import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  build: {
    chunkSizeWarningLimit: 1200,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('three/examples/jsm')) return 'three-examples'
            if (id.includes('node_modules/three') && !id.includes('three/examples/jsm')) return 'three'
            if (id.includes('@react-three/postprocessing')) return 'three-postprocessing'
            if (id.includes('@react-three/drei')) return 'drei'
            if (id.includes('@react-three/fiber')) return 'react-three-fiber'
            if (id.includes('gsap')) return 'gsap'
            if (id.includes('framer-motion')) return 'framer-motion'
            if (id.includes('react-router-dom')) return 'react-router-dom'
            if (id.includes('react')) return 'react-vendor'
          }
        },
      },
    },
  },
})

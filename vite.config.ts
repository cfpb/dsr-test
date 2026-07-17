import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Relative base so assets work on GitHub Pages at /dsr-test/ and
// nested PR previews at /dsr-test/pr-previews/pr-N/.
export default defineConfig({
  base: process.env.BASE_PATH ?? './',
  plugins: [react()],
})

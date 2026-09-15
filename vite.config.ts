import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
// GitHub Pages serves this from /studio-bloom-booking-calendar/, but local dev should stay at root.
export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/studio-bloom-booking-calendar/' : '/',
  plugins: [react(), tailwindcss()],
}))

import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { plugin as elmPlugin } from 'vite-plugin-elm';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [elmPlugin(), svelte()],
});

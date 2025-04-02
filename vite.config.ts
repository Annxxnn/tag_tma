import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import basicSsl from '@vitejs/plugin-basic-ssl';
import tsconfigPaths from 'vite-tsconfig-paths';
import { nodePolyfills } from 'vite-plugin-node-polyfills';
// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), basicSsl(), tsconfigPaths(), nodePolyfills({
    globals: {
      Buffer: true,
      process: true
    },
    protocolImports: true
  })],
  build: {
    outDir: './docs'
  },
  base: '/',
  define: {
    global: {}
  }
});

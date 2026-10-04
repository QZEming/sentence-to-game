import { defineConfig } from 'vite';
export default defineConfig({
  server: { host: '127.0.0.1', port: 5188, strictPort: true },
  build: { rollupOptions: { output: { manualChunks: { three: ['three'], effects: ['three/addons/postprocessing/EffectComposer.js','three/addons/postprocessing/RenderPass.js','three/addons/postprocessing/UnrealBloomPass.js','three/addons/postprocessing/OutputPass.js'] } } }, chunkSizeWarningLimit: 600 }
});

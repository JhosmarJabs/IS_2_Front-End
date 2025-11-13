import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react()],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.REACT_APP_API_BASE_URL': JSON.stringify(env.REACT_APP_API_BASE_URL || 'http://localhost:7256/api/auth')
      },
      resolve: {
        alias: {
          // FIX: `__dirname` is not available in ES modules. Replaced `path.resolve(__dirname, '.')` with `path.resolve('.')`
          // which resolves from the current working directory (project root when running vite).
          '@': path.resolve('.'),
        }
      }
    };
});

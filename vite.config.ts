import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    
    // Configuración HTTPS solo para desarrollo local
    const isProduction = mode === 'production';
    
    let httpsConfig;
    
    if (!isProduction) {
      // Desarrollo: Intentar usar certificados locales
      const keyPath = path.resolve(__dirname, 'ssl/key.pem');
      const certPath = path.resolve(__dirname, 'ssl/cert.pem');
      
      if (fs.existsSync(keyPath) && fs.existsSync(certPath)) {
        httpsConfig = {
          key: fs.readFileSync(keyPath),
          cert: fs.readFileSync(certPath),
        };
      } else {
        // Si no existen certificados, usar HTTP en desarrollo
        console.warn('⚠️  Certificados SSL no encontrados. Usando HTTP.');
        httpsConfig = false;
      }
    } else {
      // Producción: Vercel maneja HTTPS automáticamente
      httpsConfig = false;
    }
    
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
        https: httpsConfig,
      },
      plugins: [react()],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.REACT_APP_API_BASE_URL': JSON.stringify(
          env.REACT_APP_API_BASE_URL || 'https://is-2-back-end.onrender.com/api/auth'
        )
      },
      resolve: {
        alias: {
          '@': path.resolve('.'),
        }
      }
    };
});
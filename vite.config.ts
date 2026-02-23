
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
        'process.env.SUPABASE_URL': JSON.stringify('https://nodngrbhschbkgwjmrfx.supabase.co'),
        'process.env.SUPABASE_ANON_KEY': JSON.stringify('sb_publishable_PlQfNhZinhSQn0560SBGRQ_OukA-CCH')
      },
      resolve: {
        alias: {
          '@': path.resolve('.'),
        }
      }
    };
});

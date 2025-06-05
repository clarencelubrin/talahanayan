import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tsconfigPaths from 'vite-tsconfig-paths'
import vercel from 'vite-plugin-vercel';
// https://vite.dev/config/

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    server: {
      port: env.VITE_PORT as unknown as number,
      proxy: {
        '/bookkeeperAPI': {
          target: env.VITE_API_URL,
          changeOrigin: true,
          secure: false,      
          ws: true,
          rewrite: (path) => path.replace(/^\/bookkeeperAPI/, ''),
          configure: (proxy, _options) => {
            proxy.on('error', (err, _req, _res) => {
              console.log('proxy error', err);
            });
            proxy.on('proxyReq', (_, req, _res) => {
              console.log('Sending Request to the Target:', req.method, req.url);
            });
            proxy.on('proxyRes', (proxyRes, req, _res) => {
              console.log('Received Response from the Target:', proxyRes.statusCode, req.url);
            });
          },
        }
      }
    },
    plugins: [
      react(), 
      tsconfigPaths(),
      vercel()
    ],
    define: {
      __APP_ENV__: JSON.stringify(env.APP_ENV),
    },
  }
})

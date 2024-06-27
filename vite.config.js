/* eslint-disable no-undef */
import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';
import envCompatible from 'vite-plugin-env-compatible';
import eslint from 'vite-plugin-eslint';
import svgrPlugin from 'vite-plugin-svgr';
import tsconfigPaths from 'vite-tsconfig-paths';

// https://vitejs.dev/config/
export default ({ mode }) => {
  Object.assign(process.env, loadEnv(mode, process.cwd(), ''));
  return defineConfig({
    envPrefix: 'REACT_APP_',
    // This changes the out put dir from dist to build
    // comment this out if that isn't relevant for your project

    resolve: {
      alias: [{ find: /^~/, replacement: '' }]
    },
    plugins: [
      react(),
      envCompatible(),
      tsconfigPaths(),
      eslint(),
      svgrPlugin({
        svgrOptions: {
          icon: true
        }
      })
    ],
    build: {
      outDir: 'build',
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (
              id.includes('rc-') ||
              id.includes('antd/es') ||
              id.includes('antv') ||
              id.includes('axios') ||
              id.includes('moment') ||
              id.includes('react') ||
              id.includes('quill') ||
              id.includes('micromark')
            ) {
              return id.toString().split('node_modules/')[1].split('/')[0].toString();
            }
          }
        }
      }
    },
    server: {
      proxy: {
        [process.env.REACT_APP_BASE_PREFIX_HQREVENUE]: {
          target: process.env.REACT_APP_BASE_URL_HQREVENUE,
          changeOrigin: true,
          secure: false
        },
        [process.env.REACT_APP_BASE_PREFIX_WEBHOOK_AUTOMATE]: {
          target: process.env.REACT_APP_API_PROXY_BASE_URL,
          changeOrigin: true,
          secure: false
        }
      },
      open: true,
      host: true,
      port: 3003
      // hmr: {
      //   overlay: false
      // }
    },
    css: {
      preprocessorOptions: {
        less: {
          javascriptEnabled: true
        }
      }
    }
  });
};

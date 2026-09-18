import { defineConfig, loadEnv } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import vue from '@vitejs/plugin-vue';
import { fileURLToPath, URL } from 'node:url';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), '');
    const allowedHosts = (env.VITE_ALLOWED_HOSTS || '')
        .split(',')
        .map((host) => host.trim())
        .filter(Boolean);

    return {
        appType: 'spa',
        plugins: [vue(), tailwindcss()],
        server: {
            port: 5173,
            strictPort: true,
            allowedHosts,
        },
        resolve: {
            alias: {
                '@': fileURLToPath(new URL('./src', import.meta.url)),
            },
        },
        build: {
            rollupOptions: {
                input: 'src/main.js',
            },
        },
    };
});

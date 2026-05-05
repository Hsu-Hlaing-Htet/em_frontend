import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import tailwindcss from '@tailwindcss/vite';
import vue from '@vitejs/plugin-vue';
import { fileURLToPath, URL } from 'node:url';

export default defineConfig({
    plugins: [
        vue(),
        laravel({
            input: ['src/assets/styles/app.css', 'src/app.js'],
            publicDirectory: '../backend/public',
            buildDirectory: 'build',
            refresh: ['../backend/resources/views/**', '../backend/routes/**', 'src/**'],
        }),
        tailwindcss(),
    ],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url)),
        },
    },
    server: {
        watch: {
            ignored: ['../backend/storage/framework/views/**'],
        },
    },
    build: {
        emptyOutDir: true,
    },
});

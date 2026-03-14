import path from 'node:path';
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      { find: '@/app', replacement: path.resolve(__dirname, 'app') },
      { find: '@/components', replacement: path.resolve(__dirname, 'components') },
      { find: '@/entities', replacement: path.resolve(__dirname, 'src/entities') },
      { find: '@/features', replacement: path.resolve(__dirname, 'src/features') },
      { find: '@/lib', replacement: path.resolve(__dirname, 'lib') },
      { find: '@/pages', replacement: path.resolve(__dirname, 'src/page-views') },
      { find: '@/processes', replacement: path.resolve(__dirname, 'src/processes') },
      { find: '@/shared', replacement: path.resolve(__dirname, 'src/shared') },
      { find: '@/widgets', replacement: path.resolve(__dirname, 'src/widgets') },
      { find: '@', replacement: path.resolve(__dirname, '.') },
    ],
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
    include: ['src/**/*.test.{ts,tsx}'],
    clearMocks: true,
    restoreMocks: true,
  },
});

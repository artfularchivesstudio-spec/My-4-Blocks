/**
 * 🧪 Vitest Configuration - The Test Alchemist's Laboratory ✨
 *
 * "Where code meets its destiny,
 * through the fires of rigorous testing."
 *
 * - The Quality Assurance Virtuoso
 */
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'node', // Use node for API tests, jsdom for component tests
    globals: true,
    include: ['**/*.test.ts', '**/*.test.tsx'],
    exclude: ['**/node_modules/**', '.next', '**/shared/node_modules/**'],
    setupFiles: ['./vitest.setup.ts'],
    // 🌟 Separate coverage for shared lib
    coverage: {
      provider: 'v8',
      include: ['shared/**/*.ts', 'app/api/**/*.ts'],
      exclude: ['**/*.test.ts', '**/__tests__/**'],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },
});

import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    // Use jsdom as the default test environment for DOM manipulation
    environment: 'jsdom',
    // Global test setup files
    setupFiles: ['./src/tests/setup.ts'],
    // Allow global test functions without importing
    globals: true,
    // Configure test coverage
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/tests/setup.ts',
        '**/*.d.ts',
        '**/*.config.*',
        '**/mocks/**',
      ],
    },
    // Configure include/exclude patterns
    include: ['**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    exclude: ['node_modules', 'dist', '.idea', '.git', '.cache'],
    // Configure test timeouts
    testTimeout: 20000,
    // Hook timeout for setup/teardown
    hookTimeout: 10000,
    deps: {
      inline: [
        '@testing-library/react',
        '@testing-library/user-event',
        '@testing-library/jest-dom'
      ]
    }
  },
  resolve: {
    alias: {
      // Match your tsconfig path aliases
      '@': path.resolve(__dirname, './src'),
    },
  },
}); 

import swc from 'unplugin-swc'
import { defineConfig } from 'vitest/config'
import tsConfifPaths from 'vite-tsconfig-paths'

export default defineConfig({
  test: {
    include: ['**/*.e2.spec.ts'],
    globals: true,
    root: './',
    setupFiles: ['./tests/setup-e2e.ts'],
  },
  plugins: [
    tsConfifPaths(),
    swc.vite({
      module: { type: 'es6' },
    }),
  ],
})

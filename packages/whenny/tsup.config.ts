import { defineConfig } from 'tsup'

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    'config/index': 'src/config/index.ts',
    'themes/index': 'src/themes/index.ts',
    'natural/index': 'src/natural/index.ts',
  },
  format: ['cjs', 'esm'],
  dts: true,
  splitting: true,
  sourcemap: true,
  clean: true,
  treeshake: true,
  minify: false,
  external: ['react-day-picker'],
})

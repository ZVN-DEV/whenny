import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  // Mark whenny as external - it's dynamically imported at runtime by the MCP command
  external: ['whenny'],
  // Shebang is already in src/index.ts, no need for banner
})

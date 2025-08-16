import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts', 'src/helpers/chain.ts'],
  format: ['esm'],
  dts: true,
  sourcemap: true,
  clean: true,
})

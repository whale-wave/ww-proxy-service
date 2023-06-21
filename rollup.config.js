import commonjs from '@rollup/plugin-commonjs'
import terser from '@rollup/plugin-terser'

export default {
  input: 'dist/index.js',
  output: {
    dir: 'terser',
    format: 'cjs',
  },
  plugins: [commonjs(), terser()],
}

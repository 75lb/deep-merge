import { nodeResolve } from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs';

export default [
  {
    input: 'index.js',
    output: {
      file: 'dist/index.mjs',
      format: 'esm'
    },
    external: [],
    plugins: [
      commonjs(),
      nodeResolve({ preferBuiltins: true })
    ]
  }
]

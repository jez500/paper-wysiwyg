import buble from '@rollup/plugin-buble';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import globals from 'rollup-plugin-node-globals';

export default {
  input: 'public/demo.js',
  output: { format: 'iife', file: 'public/demo_bundle.js' },
  plugins: [
    // buble({
    //   exclude: 'node_modules/**',
    //   namedFunctionExpressions: false,
    // }),

    nodeResolve({
      main: true,
      browser: true,
    }),

    commonjs({
      include: '../**',
      sourceMap: false,
    }),

    globals(),
  ],
};

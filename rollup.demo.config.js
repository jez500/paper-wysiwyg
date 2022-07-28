import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import globals from 'rollup-plugin-node-globals';
import css from "rollup-plugin-css-only";

export default [
  {
    input: 'demo/demo.js',
    output: { format: 'iife', file: 'demo/demo_bundle.js' },
    plugins: [
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
  },
  {
    input: 'dist/styles.css',
    output: { format: 'iife', file: 'demo/styles.js' },
    plugins: [
      css({
        output: 'styles.css'
      })
    ]
  }
];

import VuePlugin from 'rollup-plugin-vue'
import scssPlugin from 'rollup-plugin-scss'
import postcss from 'postcss'
import autoprefixer from 'autoprefixer'
import commonjs from '@rollup/plugin-commonjs';
import replacePlugin from 'rollup-plugin-replace';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import globals from 'rollup-plugin-node-globals';
import { terser } from "rollup-plugin-terser";
import babel from 'rollup-plugin-babel';
import buble from '@rollup/plugin-buble'

const bundleJsByFormat = (format = 'esm', filename = 'paper-wysiwyg.js') => {
  return {
    input: 'src/scripts/PaperWysiwyg.vue',
    output: [{
      format: format,
      file: 'dist/' + filename,
      // Only ever have this uncommented for debugging.
      // sourcemap: 'inline',
      name: 'PaperWysiwyg',
      exports: 'named',
      globals: {
        vue: 'Vue',
        axios: 'axios',
      }
    }],
    external: [
      'vue',
      'axios',
    ],
  }
}

const bundleJsByFormatPlugins = () => [
  replacePlugin({
    'process.env.NODE_ENV': JSON.stringify('production'),
  }),
  VuePlugin(),
  nodeResolve({
    extensions: ['.js', '.vue'],
  }),
  //globals(),
  commonjs({
    extensions: ['.js'],
  }),
  babel({
    exclude: 'node_modules/**',
    runtimeHelpers: true,
    extensions: ['.js', '.ts'],
    presets: [
      [
        '@babel/preset-env',
        {
          modules: false,
          useBuiltIns: 'usage',
          corejs: 3,
        },
      ],
    ],
  }),
  buble({
    exclude: 'node_modules/**',
    namedFunctionExpressions: false,
  }),
]

export default [
  // Scripts.
  {
    ...bundleJsByFormat('umd', 'paper-wysiwyg.umd.js'),
    plugins: bundleJsByFormatPlugins()
  },
  {
    ...bundleJsByFormat('es', 'paper-wysiwyg.esm.js'),
    plugins: bundleJsByFormatPlugins()
  },
  {
    ...bundleJsByFormat('iife', 'paper-wysiwyg.min.js'),
    plugins: [
      ...bundleJsByFormatPlugins(),
      terser()
    ]
  },
  // Styles.
  {
    input: 'src/styles/_all.scss',
    output: {
      format: 'esm',
      file: 'dist/styles.js',
    },
    plugins: [
      nodeResolve({
        extensions: ['.css'],
      }),
      scssPlugin({
        processor: () => postcss([autoprefixer()]),
        outputStyle: 'compressed'
      }),
      globals(),
      commonjs(),
    ]
  }
]
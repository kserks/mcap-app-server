import styles           from 'rollup-plugin-styles'
import resolve          from '@rollup/plugin-node-resolve';
import babel            from '@rollup/plugin-babel';


import svelte from 'rollup-plugin-svelte';
import commonjs from '@rollup/plugin-commonjs';

import { terser } from 'rollup-plugin-terser';
import css from 'rollup-plugin-css-only';

let production = false

export default [

  {
    input: './src/pb/main.js',
    output: [
      {
        file: './app/pb/app.js',
        format: 'iife',
        name: 'paint_board'
      }
    ],
    plugins: [

      styles(),
      resolve(),
      babel({ babelHelpers: 'bundled' })
    ],
    watch: ['./src/pb']

  },

  {
    input: './src/chess/main.js',
    output: [
      {
        file: './app/chess/app.js',
        format: 'iife',
        name: 'chess'
      }
    ],
    plugins: [

      styles(),
      resolve(),
      babel({ babelHelpers: 'bundled' })
    ],
    watch: ['./src/chess']

  },
  /*gallery*/
{
  input: 'src/gallery/gallery/main.js',
  output: {
    sourcemap: true,
    format: 'iife',
    name: 'app',
    file: 'app/gallery/_gallery/build/bundle.js'
  },
  plugins: [
    svelte({
      compilerOptions: {
        // enable run-time checks when not in production
        dev: !production
      }
    }),

    css({ output: 'bundle.css' }),

    resolve({
      browser: true,
      dedupe: ['svelte']
    }),
    commonjs(),


    // If we're building for production (npm run build
    // instead of npm run dev), minify
    production && terser()
  ],
  watch: ['src/gallery']
}
]
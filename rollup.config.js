import styles           from 'rollup-plugin-styles'
import resolve          from '@rollup/plugin-node-resolve';
import babel            from '@rollup/plugin-babel';




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
    watch: ['./src']

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
    watch: ['./src']

  },
]
import typescript from '@rollup/plugin-typescript';
import resolve from '@rollup/plugin-node-resolve';
import { babel } from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import { terser } from 'rollup-plugin-terser';
import externals from 'rollup-plugin-node-externals';
import del from 'rollup-plugin-delete';
import postcss from 'rollup-plugin-postcss';
import pkg from './package.json';

export default {
  input: 'lib/index.ts',
  output: [
    { file: pkg.main, format: 'cjs' },
    { file: pkg.module, format: 'esm' },
  ],
  plugins: [
    del({ targets: 'dist/*' }),
    externals({ deps: true }),
    postcss({
      extensions: ['.css'],
    }),
    resolve({
      extensions: ['.js', '.ts', '.tsx'],
    }),
    commonjs(),
    babel({
      babelHelpers: 'runtime',
      exclude: 'node_modules/**',
    }),
    typescript(),
    terser(),
  ],
};

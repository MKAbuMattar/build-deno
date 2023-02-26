import { readFileSync } from 'fs';
import replace from '@rollup/plugin-replace';
import resolve from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';
import typescript from '@rollup/plugin-typescript';
import dts from 'rollup-plugin-dts';

const loadJSON = (path) =>
  JSON.parse(readFileSync(new URL(path, import.meta.url)));

const pkg = loadJSON('./package.json');

export default [
  {
    input: 'src/index.ts',
    plugins: [
      resolve(),
      terser(),
      typescript({
        tsconfig: 'tsconfig.json',
        declaration: true,
        declarationDir: 'types',
        rootDir: './src/',
        sourceMap: false,
      }),
    ],
    output: [
      {
        file: 'lib/index.js',
        name: 'BuildDeno',
        format: 'cjs',
        sourcemap: false,
      },
      {
        file: 'lib/index.mjs',
        name: 'BuildDeno',
        format: 'es',
        sourcemap: false,
      },
    ],
  },
  {
    input: 'lib/types/index.d.ts',
    plugins: [resolve(), dts()],
    output: [{ file: 'lib/index.d.ts', format: 'es' }],
  },
  {
    input: 'src/cli.ts',
    plugins: [
      replace({
        preventAssignment: true,
        __VERSION__: pkg.version,
      }),
      resolve(),
      terser(),
      typescript({
        tsconfig: 'tsconfig.json',
        rootDir: '',
        sourceMap: false,
      }),
    ],
    output: [
      {
        file: 'lib/cli.js',
        name: 'BuildDeno',
        format: 'cjs',
        sourcemap: false,
        banner: '#!/usr/bin/env node',
      },
    ],
  },
];

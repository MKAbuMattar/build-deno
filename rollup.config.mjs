import typescript from '@rollup/plugin-typescript';
import resolve from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';
import dts from 'rollup-plugin-dts';

export default [
  {
    input: 'src/index.ts',
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
    plugins: [
      terser(),
      typescript({
        tsconfig: 'tsconfig.esm.json',
        declaration: true,
        declarationDir: 'types',
        rootDir: 'src/',
        sourceMap: false,
      }),
      resolve(),
    ],
  },
  {
    input: 'lib/types/index.d.ts',
    output: [{ file: 'lib/index.d.ts', format: 'es' }],
    plugins: [dts()],
  },
];

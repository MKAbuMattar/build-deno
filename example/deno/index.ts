import type {
  Path,
  SkipFile,
  ChangePackage,
  CopyFiles,
  Options,
} from 'types/index.ts';
import { build } from './core/build.ts';

export type { Path, SkipFile, ChangePackage, CopyFiles, Options };
export { build };

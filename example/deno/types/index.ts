export type Path = string;

export type SkipFile = {
  dir: Path;
  name: Path;
};

export type ChangePackage = {
  byPackageName?: boolean;
  package: string;
  replace: string;
};

export type CopyFiles = {
  from: Path;
  to: Path;
};

export type ProjectPaths = {
  projectRoot: string;
  nodeSrcRoot: string;
  denoSrcRoot: string;
};

export type Options = {
  root: Path;
  rootDir: Path;
  outDir: Path;
  changePackage?: ChangePackage[];
  skipFile?: SkipFile[];
  copyFiles?: CopyFiles[];
};

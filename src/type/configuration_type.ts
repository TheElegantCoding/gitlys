type ConfigType = {
  prePushTask?: string[];
  preCommitTask?: Record<string, string>;
  packageManager?: 'npm' | 'bun' | 'yarn' | 'pnpm';
  release?: {
    files?: string[];
    releaseToGithub?: boolean;
  };
  commitlint?: {
    maxLength?: number;
    allowedTypes?: string[];
  };
  changelog?: {
    changelogPath?: string;
    generateChangelog?: boolean;
  };
};

export type { ConfigType };
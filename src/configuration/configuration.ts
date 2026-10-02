import { commonCommit } from '@src/constant/commit_constant.js';

import type { ConfigType } from '@src/type/configuration_type.js';

const config: ConfigType = {
  commitlint: {
    allowedTypes: commonCommit,
    maxLength: 120
  },
  preCommitTask: {},
  prePushTask: [],
  release: {
    files: ['package.json'],
    releaseToGithub: false
  },
  changelog: {
    changelogPath: 'CHANGELOG.md',
    generateChangelog: false
  },
  packageManager: 'npm'
};

export { config };
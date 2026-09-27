import { commonCommit } from '@src/constant/commit_constant.js';

import type { ConfigurationType } from '@src/type/configuration_type.js';

const configuration: ConfigurationType = {
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

export { configuration };
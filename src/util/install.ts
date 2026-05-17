import { getConfiguration } from '@src/util/file_configuration.js';
import { handleError } from '@src/util/handle_error.js';
import { logger } from '@src/util/logger.js';
import fs from 'node:fs';
import path from 'node:path';

import type { ConfigurationType } from '@src/type/configuration_type.js';

const checkGitDirectory = (directory: string): boolean => {
  const gitPath = path.join(directory, '.git');

  if (!fs.existsSync(gitPath)) {
    logger.warning('No .git directory found. Please run "git init" before installing Gitlys hooks.');
    return false;
  }

  if (!fs.statSync(gitPath).isDirectory()) {
    logger.warning('.git exists but is not a directory. Please ensure you are in a valid Git repository.');
    return false;
  }

  return true;
};

const createHookContent = (configuration: ConfigurationType, isProduction: boolean) => {
  const install = isProduction
    ? `${configuration.packageManager} ./node_modules/gitlys/dist/index.js "$1"`
    : `${configuration.packageManager} src/index.ts "$1"`;
  const preCommitTaskCommand = isProduction
    ? `${configuration.packageManager} ./node_modules/gitlys/dist/pre_commit_task.js "$1"`
    : `${configuration.packageManager} src/pre_commit_task.ts`;
  const prePushTaskCommand = isProduction
    ? `${configuration.packageManager} ./node_modules/gitlys/dist/pre_push_task.js "$1"`
    : `${configuration.packageManager} src/pre_push_task.ts`;

  const hookContent = `#!/bin/bash\n\n${install}`;
  const preCommitContent = `#!/bin/bash\n\n${preCommitTaskCommand}`;
  const prePushContent = `#!/bin/bash\n\n${prePushTaskCommand}`;

  return { hookContent, preCommitContent, prePushContent };
};

const installCommand = (gitHooksDirectory: string) => {
  const commitMessageHook = path.join(gitHooksDirectory, 'commit-msg');
  const preCommitHook = path.join(gitHooksDirectory, 'pre-commit');
  const prePushHook = path.join(gitHooksDirectory, 'pre-push');
  const isProduction = import.meta.url.includes('node_modules');
  const configuration = getConfiguration();

  const { hookContent, preCommitContent, prePushContent } = createHookContent(configuration, isProduction);

  return {
    commitMessageHook,
    preCommitHook,
    prePushHook,
    hookContent,
    preCommitContent,
    prePushContent
  };
};

const prepare = ({
  commitMessageHook,
  preCommitHook,
  prePushHook,
  hookContent,
  preCommitContent,
  prePushContent
}: ReturnType<typeof installCommand>) => {
  fs.writeFileSync(commitMessageHook, hookContent);
  fs.chmodSync(commitMessageHook, '755');

  fs.writeFileSync(preCommitHook, preCommitContent);
  fs.chmodSync(preCommitHook, '755');

  fs.writeFileSync(prePushHook, prePushContent);
  fs.chmodSync(prePushHook, '755');

  logger.setup('Git hooks installed successfully!');
};

const init = () => {
  const projectRoot = process.env.INIT_CWD ?? process.cwd();
  const gitHooksDirectory = path.join(projectRoot, '.git', 'hooks');

  if (!checkGitDirectory(projectRoot)) {
    return;
  }

  const {
    commitMessageHook,
    hookContent,
    preCommitHook,
    prePushHook,
    preCommitContent,
    prePushContent
  } = installCommand(gitHooksDirectory);

  try {
    prepare({
      commitMessageHook,
      preCommitHook,
      prePushHook,
      hookContent,
      preCommitContent,
      prePushContent
    });
  } catch (error) {
    handleError(error, 'Error installing Gitlys hooks:');
  }
};

export { init };

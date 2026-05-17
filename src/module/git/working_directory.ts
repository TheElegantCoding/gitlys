import { execAsync } from '@src/util/command_runner.js';

const isWorkingDirectoryClean = async () => {
  const { stdout } = await execAsync('git status --porcelain');
  const status = stdout.toString().trim();

  if (status.length > 0) {
    throw new Error('Working directory is not clean. Please commit or stash your changes before releasing.');
  }
};

export { isWorkingDirectoryClean };
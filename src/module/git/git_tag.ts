import { execAsync } from '@src/util/command_runner.js';
import { loggerLoader } from '@src/util/logger.js';

const createTag = async (version: string) => {
  const loader = loggerLoader(`Creating git tag v${version}`);
  loader.start();
  await execAsync(`git tag v${version}`);
  loader.stop();
};

const tagExists = async () => {
  try {
    const tags = (await execAsync('git tag --list')).toString();
    return tags.length > 0;
  } catch {
    return false;
  }
};

export { tagExists, createTag };
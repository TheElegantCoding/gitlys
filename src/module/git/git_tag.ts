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
    const { stdout } = await execAsync('git tag --list');
    const tags = stdout.toString().trim().split('\n').filter(Boolean);
    return tags.length > 0;
  } catch {
    return false;
  }
};

export { tagExists, createTag };
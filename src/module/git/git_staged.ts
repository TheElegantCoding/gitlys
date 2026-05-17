import { execAsync } from '@src/util/command_runner.js';
import { logger } from '@src/util/logger.js';

const getStagedFiles = async (): Promise<string[]> => {
  const { stdout } = await execAsync('git diff --cached --name-only --diff-filter=d');
  const stagedFiles = stdout
    .toString()
    .trim()
    .split('\n')
    .filter(Boolean);

  if (stagedFiles.length === 0) {
    logger.info('No staged files found. Skipping tasks.');
    return [];
  }

  return stagedFiles;
};

const stageFiles = async (files: string[]): Promise<void> => {
  await execAsync(`git add ${files.join(' ')}`);
};

export { stageFiles, getStagedFiles };
import { stageFiles } from '@src/module/git/git_staged.js';
import { loggerLoader } from '@src/util/logger.js';
import { exec } from 'node:child_process';
import { promisify } from 'node:util';

const execAsync = promisify(exec);

const runCommand = async (command: string, files?: string[]): Promise<void> => {
  const filesToPass = command.includes('tsc') ? '' : files?.map((entry) => { return `"${entry}"`; }).join(' ') ?? '';
  const loader = loggerLoader(`Running: "${command}"...`);

  loader.start();
  await execAsync(`${command} ${filesToPass}`);

  if (files && files.length > 0) {
    await stageFiles(files);
  }

  loader.stop();
};

export { execAsync, runCommand };
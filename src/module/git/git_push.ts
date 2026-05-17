import { execAsync } from '@src/util/command_runner.js';
import { loggerLoader } from '@src/util/logger.js';

const getPushFiles = async (): Promise<string[]> => {
  const { stdout } = await execAsync('git log --format="%h" HEAD --not --remotes');

  const output = stdout
    .toString()
    .trim()
    .split('\n')
    .filter(Boolean);

  if (output.length === 0) { return []; }

  const firstCommit = output[0] ?? '';
  const lastCommit = output.at(-1) ?? '';

  const { stdout: diffStdout } = await execAsync(`git diff --name-only ${firstCommit} ${lastCommit}`);

  const outputLoader = diffStdout
    .toString()
    .trim()
    .split('\n')
    .filter(Boolean);

  return outputLoader;
};

const gitPushTag = async (version: string): Promise<void> => {
  const loader = loggerLoader('Pushing tag to remote repository...');
  loader.start();
  await execAsync(`git push origin v${version}`);
  loader.stop();
};

const gitPushHead = async (): Promise<void> => {
  const loader = loggerLoader('Pushing changes to remote repository...');
  loader.start();
  await execAsync('git push origin HEAD');
  loader.stop();
};

export { gitPushTag, gitPushHead, getPushFiles };
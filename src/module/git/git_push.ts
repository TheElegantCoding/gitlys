import { execAsync } from '@src/util/command_runner.js';
import { loggerLoader } from '@src/util/logger.js';

const getPushFiles = async (): Promise<string[]> => {
  const output = (await execAsync('git log --format="%h" HEAD --not --remotes'))
    .toString()
    .trim()
    .split('\n')
    .filter(Boolean);
  const firstCommit = output[0] ?? '';
  const lastCommit = output.at(-1) ?? '';
  const outputLoader = (await execAsync(`git diff --name-only ${firstCommit} ${lastCommit}`))
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
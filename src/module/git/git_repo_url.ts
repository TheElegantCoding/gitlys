import { execAsync } from '@src/util/command_runner.js';

const getRepoUrl = async (): Promise<string> => {
  const { stdout } = await execAsync('git config --get remote.origin.url');
  return stdout.toString().trim().replace(/\.git$/, '');
};

export { getRepoUrl };
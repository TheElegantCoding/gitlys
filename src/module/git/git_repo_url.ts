import { execAsync } from '@src/util/command_runner.js';

const getRepoUrl = async (): Promise<string> => {
  return (await execAsync('git config --get remote.origin.url')).toString().trim().replace(/\.git$/, '');
};

export { getRepoUrl };
import { execAsync } from '@src/util/command_runner.js';

const isGhInstalled = async (): Promise<boolean> => {
  try {
    const command = process.platform === 'win32' ? 'where gh' : 'command -v gh';
    await execAsync(command);
    return true;
  } catch {
    return false;
  }
};

export { isGhInstalled };
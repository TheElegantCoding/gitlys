import { config } from '@src/configuration/configuration.js';
import fs from 'node:fs';
import path from 'node:path';

import type { ConfigType } from '@src/type/configuration_type.js';

const getConfigFile = () => {
  const configPath = path.join(process.cwd(), '.gitlys.json');

  if (!fs.existsSync(configPath)) {
    return JSON.stringify(config);
  }
  const configContent = fs.readFileSync(configPath, 'utf8');

  return configContent;
};

const getConfig = () => {
  const configContent = getConfigFile();
  const configFile = JSON.parse(configContent) as null | ConfigType;

  if (typeof configFile !== 'object' || configFile === null) {
    throw new Error('Invalid configuration format in .gitlys.json');
  }

  return {
    ...config,
    ...configFile,
    commitlint: { ...config.commitlint, ...configFile.commitlint },
    preCommitTask: { ...config.preCommitTask, ...configFile.preCommitTask },
    release: { ...config.release, ...configFile.release },
    changelog: { ...config.changelog, ...configFile.changelog }
  };
};

export { getConfig };
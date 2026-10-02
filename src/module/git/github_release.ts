import { execAsync } from '@src/util/command_runner.js';
import { getConfig } from '@src/util/file_configuration.js';
import { logger, loggerLoader } from '@src/util/logger.js';
import { isGhInstalled } from '@src/util/validation.js';
import fs from 'node:fs';

import type { ConfigType } from '@src/type/configuration_type.js';

const checkGithubRelease = async (config: ConfigType) => {
  if (config.release?.releaseToGithub === false) {
    return false;
  }

  const ghValidation = await isGhInstalled();

  if (!ghValidation) {
    logger.warning('GitHub CLI (gh) is not installed. Skipping GitHub release creation.');
    return false;
  }

  return true;
};

const githubCreateRelease = async (version: string, releaseNotes: string) => {
  const config = getConfig();

  if (!await checkGithubRelease(config)) {
    return;
  }

  const temporaryNotesPath = './TEMP_RELEASE_NOTES.md';

  const loader = loggerLoader(`Creating GitHub release for version ${version}...`);
  loader.start();
  fs.writeFileSync(temporaryNotesPath, releaseNotes, 'utf8');
  await execAsync(`gh release create v${version} --title "Release ${version}" --notes-file "${temporaryNotesPath}"`);
  fs.unlinkSync(temporaryNotesPath);
  loader.stop();
};

export { githubCreateRelease };
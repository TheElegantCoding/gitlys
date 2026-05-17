import { changelogConstant } from '@src/constant/changelog.js';
import { getRepoUrl } from '@src/module/git/git_repo_url.js';
import { getConfiguration } from '@src/util/file_configuration.js';
import { logger, loggerLoader } from '@src/util/logger.js';
import fs from 'node:fs';
import path from 'node:path';

import type { CommitType } from '@src/type/commit_type.js';

const createChangelogFile = () => {
  const configuration = getConfiguration();
  const fullPath = path.join(process.cwd(), configuration.changelog.changelogPath ?? 'CHANGELOG.md');

  if (!configuration.changelog.generateChangelog) {
    return;
  }

  if (!fs.existsSync(fullPath)) {
    logger.info('Generating changelog...');
    fs.writeFileSync(fullPath, changelogConstant.template);
  }
};

const checkVersionExists = (version: string, fullPath: string): boolean => {
  const existingContent = fs.readFileSync(fullPath, 'utf8');
  const versionHeader = `## 🚀 Version [${version}]`;

  if (existingContent.includes(versionHeader)) {
    return true;
  }
  return false;
};

const createEntry = async (version: string, fullPath: string, commits: CommitType[]): Promise<string> => {
  const date = new Date().toISOString().split('T')[0];
  const existingContent = fs.readFileSync(fullPath, 'utf8');
  const github = 'https://github.com';
  const gitUrl = await getRepoUrl();

  const changes = commits.map((commit) => {
    const {
      cleanMessage,
      type,
      hash,
      author
    } = commit;
    return `- **${type}:** ${cleanMessage} [\`${hash}\`](${gitUrl}/commit/${hash}) by [\`@${author}\`](${github}/${author})`;
  });

  const newEntry = `## 🚀 Version [${version}] - ${date}\n\n${changes.join('\n')}`;

  const updatedContent = existingContent.replace('## Released', `## Released\n\n${newEntry}`);
  return updatedContent;
};

const validChangelog = (fullPath: string, version: string): boolean => {
  if (!fs.existsSync(fullPath)) {
    return false;
  }

  if (checkVersionExists(version, fullPath)) {
    return false;
  }

  return true;
};

const updateChangelog = async (version: string, commits: CommitType[]) => {
  const configuration = getConfiguration();
  const fullPath = path.join(process.cwd(), configuration.changelog.changelogPath ?? 'CHANGELOG.md');

  if (!validChangelog(fullPath, version)) {
    return;
  }

  const loader = loggerLoader(`Updating changelog for version ${version} with ${commits.length} commits...`);

  loader.start();
  const updatedContent = await createEntry(version, fullPath, commits);
  fs.writeFileSync(fullPath, updatedContent);
  loader.stop();
};

export { updateChangelog, checkVersionExists, createChangelogFile };
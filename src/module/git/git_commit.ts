import { tagExists } from '@src/module/git/git_tag.js';
import { execAsync } from '@src/util/command_runner.js';
import { getConfiguration } from '@src/util/file_configuration.js';
import { reportLogger } from '@src/util/file_logger.js';
import { logger, loggerLoader } from '@src/util/logger.js';
import { colorAnsi, loggerStyle } from 'logginlys';

import type { CommitType } from '@src/type/commit_type.js';

const commitStagedVersionFiles = async (nextVersion: string) => {
  const loader = loggerLoader(`Committing staged files for version ${nextVersion}...`);
  const config = getConfiguration();
  const changelogPath = config.changelog.changelogPath ?? 'CHANGELOG.md';
  loader.start();

  await (config.changelog.generateChangelog
    ? execAsync(`git add package.json ${changelogPath}`)
    : execAsync('git add package.json'));

  await execAsync(`git commit -m "release: ${nextVersion}"`);

  loader.stop();
};

const checkStagedCommits = (commitStaged: CommitType[]) => {
  const filteredResult = commitStaged.filter((commit) => {
    return commit.author !== undefined && commit.hash !== undefined && commit.message !== undefined;
  });

  if (filteredResult.length === 0) {
    throw new Error('No valid commits found since last version. Please ensure there are staged commits to release.');
  }

  return filteredResult;
};

const getStagedCommit = async (currentVersion: string, reportCommits = true) => {
  let commits: string[] = [];

  if (await tagExists()) {
    const { stdout } = await execAsync(`git log v${currentVersion}..HEAD --pretty=format:"%s|%h|%an"`);
    commits = stdout.toString().trim().split('\n');
  } else {
    const { stdout } = await execAsync('git log --pretty=format:"%s|%h|%an"');
    commits = stdout.toString().trim().split('\n');
  }

  const result: CommitType[] = [];

  commits.forEach((entry) => {
    const [
      message,
      hash,
      author
    ] = entry.split('|');

    result.push({
      message: message?.trim(),
      hash: hash?.trim(),
      author: author?.trim(),
      type: message?.split(':')[0]?.toLowerCase() ?? '',
      cleanMessage: message?.split(':').slice(1).join(':').trim() ?? ''
    });
  });

  const filteredResult = checkStagedCommits(result);
  const gitIcon = loggerStyle.ansi('\udb80\udea2', { color: colorAnsi.red });

  if (reportCommits) {
    const commitMessage = loggerStyle.ansi(`${result.length} staged commits, since last version:`, { bold: true });
    logger.info(`Found ${gitIcon} ${commitMessage}`, { blankBelow: true });
    result.forEach((entry) => { reportLogger.commit(entry); });
    logger.blank();
  }

  return filteredResult;
};

export { getStagedCommit, commitStagedVersionFiles };
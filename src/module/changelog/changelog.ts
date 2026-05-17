import { updateChangelog, createChangelogFile } from '@src/module/changelog/changelog_file.js';
import { getStagedCommit } from '@src/module/git/git_commit.js';
import { getCurrentVersion } from '@src/module/release/version.js';
import { handleError } from '@src/util/handle_error.js';
import { logger } from '@src/util/logger.js';

import type { CommitType } from '@src/type/commit_type.js';

const changelog = async (commits?: CommitType[]) => {
  try {
    createChangelogFile();

    const currentVersion = getCurrentVersion(false);
    let stagedCommits: CommitType[] = commits ?? [];

    if (!commits) {
      stagedCommits = await getStagedCommit(currentVersion, false);
    }

    await updateChangelog(currentVersion, stagedCommits);
    logger.success(`Changelog updated successfully for version 🚀 ${currentVersion}`);
  } catch (error) {
    handleError(error, 'Error updating changelog');
  }
};

export { changelog };
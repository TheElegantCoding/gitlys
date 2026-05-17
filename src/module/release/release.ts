import { selectVersion } from '@src/module/cli/select_version.js';
import { getStagedCommit } from '@src/module/git/git_commit.js';
import { isWorkingDirectoryClean } from '@src/module/git/working_directory.js';
import { generateRelease } from '@src/module/release/generate_release.js';
import { generateReleaseNotes } from '@src/module/release/release_notes.js';
import { getCurrentVersion } from '@src/module/release/version.js';
import { handleError } from '@src/util/handle_error.js';
import { logger } from '@src/util/logger.js';

const release = async () => {
  try {
    logger.info('Releasing new version', { blankAbove: true });
    await isWorkingDirectoryClean();
    const currentVersion = getCurrentVersion();
    const commits = await getStagedCommit(currentVersion);
    const nextVersion = await selectVersion(currentVersion);
    const releaseNotes = await generateReleaseNotes(commits);

    await generateRelease(nextVersion, releaseNotes, commits);
  } catch (error) {
    handleError(error, 'Failed to release new version');
  }
};

export { release };

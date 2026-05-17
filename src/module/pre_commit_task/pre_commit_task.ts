import { getStagedFiles } from '@src/module/git/git_staged.js';
import { runCommand } from '@src/util/command_runner.js';
import { getConfiguration } from '@src/util/file_configuration.js';
import { fileReport } from '@src/util/file_report.js';
import { handleError } from '@src/util/handle_error.js';
import { logger } from '@src/util/logger.js';
import { getMatchingFiles } from '@src/util/pattern_matcher.js';

const preCommitTask = async () => {
  try {
    const config = getConfiguration();
    const preCommitTaskConfig = config.preCommitTask as Record<string, string>;
    const stagedFiles = await getStagedFiles();
    const allFiles = [];

    for (const [pattern, command] of Object.entries(preCommitTaskConfig)) {
      const matchingFiles = getMatchingFiles(pattern, stagedFiles);
      allFiles.push(...matchingFiles);

      if (matchingFiles.length > 0) {
        await runCommand(command, matchingFiles);
      }
    }

    const allFilesSet = [...new Set(allFiles)];

    if (allFilesSet.length > 0) {
      fileReport(allFilesSet);
    }

    if (stagedFiles.length > 0) {
      logger.success('All staged files have been validated and corrected.');
    }
  } catch (error) {
    handleError(error, 'Git commit failed:');
  }
};

export { preCommitTask };
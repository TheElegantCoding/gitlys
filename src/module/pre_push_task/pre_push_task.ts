import { getPushFiles } from '@src/module/git/git_push.js';
import { runCommand } from '@src/util/command_runner.js';
import { getConfiguration } from '@src/util/file_configuration.js';
import { fileReport } from '@src/util/file_report.js';
import { handleError } from '@src/util/handle_error.js';
import { logger } from '@src/util/logger.js';

const prePushTask = async () => {
  try {
    const config = getConfiguration();
    const pushFiles = await getPushFiles();

    if (!config.prePushTask || config.prePushTask.length === 0) {
      return;
    }

    for (const command of config.prePushTask) {
      await runCommand(command);
    }

    fileReport(pushFiles);

    logger.success('Pre-push tasks completed successfully!');
  } catch (error) {
    handleError(error, 'Git push failed:');
  }
};

export { prePushTask };
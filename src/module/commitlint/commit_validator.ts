import { commonCommit } from '@src/constant/commit_constant.js';
import { getCommitMessage } from '@src/module/commitlint/commit_reader.js';
import { getConfig } from '@src/util/file_configuration.js';
import { logger } from '@src/util/logger.js';
import { loggerColumn } from 'logginlys';

const checkCommitType = (message: string) => {
  const commitType = message.split(':', 1)[0]?.split('(', 1)[0]?.trim().toLowerCase();

  if (!commitType || !commonCommit.includes(commitType)) {
    throw new Error(`Invalid commit type. allowed types are:\n\n${loggerColumn(commonCommit, { width: 40, padding: 4 })}`);
  }
};

const checkCommitLength = (message: string, maxLength: number) => {
  if (message.length > maxLength) {
    throw new Error(`Commit message exceeds maximum length of ${maxLength} characters.`);
  }
};

const checkCommitPattern = (message: string, maxLength: number, allowedTypes: string[]) => {
  const commitMessagePattern = new RegExp(String.raw`^(${allowedTypes.join('|')})(\([a-zA-Z0-9_-]+\))?: .{1,${maxLength}}$`);

  if (!commitMessagePattern.test(message)) {
    throw new Error(`Commit message does not match the required pattern. It should start with one of the allowed types \n\n${loggerColumn(commonCommit, { width: 40, padding: 4 })}\noptionally followed by a scope in parentheses, and then a colon and a space before the actual message. The message should not exceed ${maxLength} characters.`);
  }
};

const validateCommit = (commandMessage?: string) => {
  logger.info('Validating commit message...');
  const { commitlint } = getConfig();
  const commitMessage = getCommitMessage(commandMessage);

  checkCommitType(commitMessage);
  checkCommitLength(commitMessage, commitlint.maxLength ?? 80);
  checkCommitPattern(commitMessage, commitlint.maxLength ?? 80, commitlint.allowedTypes ?? []);

  logger.success('Commit message is valid.');
};

export { validateCommit };

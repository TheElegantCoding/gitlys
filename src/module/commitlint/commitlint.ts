import { validateCommit } from '@src/module/commitlint/commit_validator.js';
import { handleError } from '@src/util/handle_error.js';

const commitLint = () => {
  try {
    const commandMessage = process.argv[2];
    validateCommit(commandMessage);
  } catch (error) {
    handleError(error, 'Commit linting failed');
  }
};

export { commitLint };
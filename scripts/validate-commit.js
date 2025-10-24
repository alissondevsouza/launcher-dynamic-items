const fs = require('fs');

const commitMsgFile = process.argv[2];
const commitMessage = fs.readFileSync(commitMsgFile, 'utf8').trim();

if (
  commitMessage.startsWith('Merge') ||
  commitMessage.startsWith('Revert') ||
  commitMessage.includes('[skip ci]') ||
  commitMessage.startsWith('chore: auto-update metadata')
) {
  process.exit(0);
}

const validPrefixes = /^(feat\(.+\):|feat:|fix:)/;

if (!validPrefixes.test(commitMessage)) {
  console.error('\nERROR: Invalid commit message - ${commitMessage}\n');
  console.error('The commit message must start with one of the following prefixes:\n');
  console.error('  • feat(scope): - For NEW JSON file (MAJOR bump)');
  console.error('  • feat:        - For ADDITION to existing file (MINOR bump)');
  console.error('  • fix:         - For CODE CORRECTION (PATCH bump)\n');
  process.exit(1);
}

console.log('Commit message validated successfully!');
process.exit(0);

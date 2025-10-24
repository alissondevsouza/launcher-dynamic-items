const fs = require('fs');
const path = require('path');

const hooksDir = path.join(process.cwd(), '.git', 'hooks');
const commitMsgHook = path.join(hooksDir, 'commit-msg');

if (!fs.existsSync(path.join(process.cwd(), '.git'))) {
  process.exit(0);
}

if (!fs.existsSync(hooksDir)) {
  fs.mkdirSync(hooksDir, { recursive: true });
}

const hookContent = `#!/bin/sh
node scripts/validate-commit.js "$1"
`;

fs.writeFileSync(commitMsgHook, hookContent, { mode: 0o755 });

const preCommitHook = path.join(hooksDir, 'pre-commit');
const preCommitContent = `#!/bin/sh

echo "Formatting code with Prettier..."
npx prettier --write .

git add -A

echo "Code formatted successfully!"
`;

fs.writeFileSync(preCommitHook, preCommitContent, { mode: 0o755 });

console.log('Git hooks installed successfully!');

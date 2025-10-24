const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

function determineBumpType(commitMessage) {
  let bumpType = 'patch';

  if (/^feat\(.+\):/i.test(commitMessage)) {
    bumpType = 'major';
  } else if (/^feat:/i.test(commitMessage)) {
    bumpType = 'minor';
  } else if (/^fix:/i.test(commitMessage)) {
    bumpType = 'patch';
  }

  console.log(`Bump type: ${bumpType}`);
  return bumpType;
}

function bumpVersion(version, bumpType) {
  const versionParts = version.split('.').map(v => parseInt(v));

  switch (bumpType) {
    case 'major':
      versionParts[0] += 1;
      versionParts[1] = 0;
      versionParts[2] = 0;
      break;
    case 'minor':
      versionParts[1] += 1;
      versionParts[2] = 0;
      break;
    case 'patch':
    default:
      versionParts[2] += 1;
      break;
  }

  return versionParts.join('.');
}

function updateJsonFile(filePath, bumpType) {
  try {
    const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    const oldVersion = content.version || '1.0.0';

    content.lastUpdate = new Date().toISOString();

    if (content.version) {
      const newVersion = bumpVersion(oldVersion, bumpType);
      content.version = newVersion;

      console.log(
        `Updated: ${filePath} - Version: ${oldVersion} → ${newVersion} (${bumpType.toUpperCase()}) - LastUpdate: ${content.lastUpdate}`
      );
    } else {
      content.version = '1.0.0';
      console.log(`Initialized: ${filePath} - Version: 1.0.0 (initial)`);
    }

    fs.writeFileSync(filePath, JSON.stringify(content, null, 2) + '\n');

    return true;
  } catch (error) {
    console.error(`Error updating ${filePath}:`, error.message);
    return false;
  }
}

function main() {
  try {
    const commitMessage = execSync('git log -1 --pretty=%B', { encoding: 'utf8' }).trim();

    const bumpType = determineBumpType(commitMessage);

    const menuConfigsDir = path.join(process.cwd(), 'menu-configs');

    if (!fs.existsSync(menuConfigsDir)) {
      console.error('Directory menu-configs/ not found');
      process.exit(1);
    }

    console.log(`Updating metadata in JSON files... - Bump type: ${bumpType}`);

    const files = fs
      .readdirSync(menuConfigsDir)
      .filter(file => file.endsWith('.json'))
      .map(file => path.join(menuConfigsDir, file));

    if (files.length === 0) {
      console.log('No JSON files found in menu-configs/');
      process.exit(0);
    }

    let success = true;
    for (const file of files) {
      if (!updateJsonFile(file, bumpType)) {
        success = false;
      }
    }

    console.log(success ? 'All files updated successfully!' : 'Some files failed to update');

    if (process.env.GITHUB_OUTPUT) {
      fs.appendFileSync(process.env.GITHUB_OUTPUT, `bump_type=${bumpType}\n`);
    }

    process.exit(success ? 0 : 1);
  } catch (error) {
    console.error('Fatal error:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { determineBumpType, bumpVersion, updateJsonFile };

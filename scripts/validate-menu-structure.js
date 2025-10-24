const fs = require('fs');
const path = require('path');
const Ajv = require('ajv');
const addFormats = require('ajv-formats');
const { glob } = require('glob');
const chalk = require('chalk');

const SCHEMA_PATH = path.join(__dirname, '../schema.json');
const MENU_CONFIGS_DIR = path.join(__dirname, '../menu-configs');

const error = chalk.red;
const success = chalk.green;

const ajv = new Ajv({
  allErrors: true,
  verbose: true,
  strict: true,
});
addFormats(ajv);

function loadSchema() {
  try {
    const schemaContent = fs.readFileSync(SCHEMA_PATH, 'utf8');
    return JSON.parse(schemaContent);
  } catch (err) {
    console.error('ERROR: Failed to load schema:', err.message);
    process.exit(1);
  }
}

function validateFile(filePath, validate) {
  const fileName = path.basename(filePath);

  try {
    const content = fs.readFileSync(filePath, 'utf8');

    let data;
    try {
      data = JSON.parse(content);
    } catch (parseErr) {
      console.error(error(`\nERROR: ${fileName}: JSON syntax error`));
      return { valid: false, errors: [parseErr.message] };
    }

    const valid = validate(data);

    if (!valid) {
      console.error(error(`\nERROR: ${fileName}: Validation failed`));
      return { valid: false, errors: validate.errors };
    }

    return { valid: true, data, errors: [] };
  } catch (err) {
    console.error(error(`\nERROR: ${fileName}: Error processing file`));
    return { valid: false, errors: [err.message] };
  }
}

function checkDuplicateIds(allResults) {
  const idMap = new Map();
  const duplicates = [];

  allResults.forEach(({ file, data }) => {
    if (!data || !data.items) return;

    data.items.forEach(item => {
      if (!item.id) return;

      if (idMap.has(item.id)) {
        duplicates.push({
          id: item.id,
          files: [idMap.get(item.id), file],
        });
      } else {
        idMap.set(item.id, file);
      }
    });
  });

  if (duplicates.length > 0) {
    console.error('\nERROR: Duplicate IDs found:');
    return false;
  }

  return true;
}

async function main() {
  console.log('\nValidating menu configuration files...\n');

  const schema = loadSchema();
  const validate = ajv.compile(schema);

  const files = await glob('**/*.json', {
    cwd: MENU_CONFIGS_DIR,
    absolute: true,
  });

  if (files.length === 0) {
    console.log('ERROR: No JSON files found in menu-configs/');
    process.exit(0);
  }

  const results = files.map(file => {
    const result = validateFile(file, validate);
    return {
      file: path.relative(MENU_CONFIGS_DIR, file),
      ...result,
    };
  });

  const noDuplicates = checkDuplicateIds(results);

  const hasErrors = results.some(r => !r.valid) || !noDuplicates;

  if (hasErrors) {
    console.log(error('\nERROR: Validation failed! Please fix the errors above.\n'));
    process.exit(1);
  } else {
    console.log(success('\nAll files are valid!\n'));
    process.exit(0);
  }
}

main().catch(err => {
  console.error(error('ERROR: Fatal error:'), err);
  process.exit(1);
});

/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable no-undef */

const { normalize } = require('node:path');
const { readFile, writeFile } = require('node:fs/promises');
const process = require('node:process');
const { normalizeGlob } = require('normalize-glob');

async function sortPatternFile(path) {
  let data;

  try {
    data = await readFile(normalize(path), {
      encoding: 'utf8',
    });
  } catch {
    data = null;
  }

  if (data === null) {
    return;
  }

  const result = data
    .replaceAll('\r', '\n')
    .split('\n')
    .filter((line) => line)
    .map((line) => ({
      line,
      normalized: Array.from(normalizeGlob(line, process.cwd()))[0],
    }));

  result.sort((a, b) => a.normalized.localeCompare(b.normalized));

  return writeFile(
    normalize(path),
    result.map((item) => item.line.trim()).join('\n') + '\n',
  );
}

process.argv.forEach((value, index) => {
  if (index > 1) {
    sortPatternFile(value);
  }
});

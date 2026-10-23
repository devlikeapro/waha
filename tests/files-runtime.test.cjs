const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');
const path = require('node:path');
const { test } = require('node:test');
const { detectMimetype } = require('../dist/utils/files');

test('the compiled CommonJS utility loads file-type and detects GIF media', async () => {
  const buffer = Buffer.from(
    'R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==',
    'base64',
  );
  assert.equal(await detectMimetype(buffer), 'image/gif');
});

test('unknown media retains the default fallback', async () => {
  assert.equal(
    await detectMimetype(Buffer.from('not a supported media signature')),
    'application/octet-stream',
  );
});

test('unknown media retains a caller-provided fallback', async () => {
  assert.equal(
    await detectMimetype(Buffer.from('unknown'), 'text/plain'),
    'text/plain',
  );
});

test('an ASF zero-size sub-header cannot stall the media detector', () => {
  // Public regression fixture from file-type's CVE-2026-31808 fix.
  // Run out of process so a regression cannot hang the test runner itself.
  const result = spawnSync(
    process.execPath,
    [
      '-e',
      `const { detectMimetype } = require(process.argv[1]);
       const buffer = Buffer.from('3026b2758e66cf11a6d9000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000', 'hex');
       detectMimetype(buffer).then(console.log).catch(() => { process.exitCode = 1; });`,
      path.resolve(__dirname, '../dist/utils/files.js'),
    ],
    { encoding: 'utf8', timeout: 5000 },
  );
  assert.ifError(result.error);
  assert.equal(result.status, 0, result.stderr);
  assert.equal(result.stdout.trim(), 'application/octet-stream');
});

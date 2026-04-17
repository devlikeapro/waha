#!/usr/bin/env node
'use strict';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const fs = require('fs');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { execSync } = require('child_process');

const CONFIG_FILE = 'waha.config.json';

const config = JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf8'));
const { repo } = config.waha.dashboard;
if (!repo) {
  console.error(`Missing dashboard.repo in ${CONFIG_FILE}`);
  process.exit(1);
}

const branch = 'gh-pages';
console.log(`Fetching latest commit for ${repo}@${branch}...`);

const output = execSync(
  `git ls-remote https://github.com/${repo} refs/heads/${branch}`,
  { encoding: 'utf8' },
);

const sha = output.split('\t')[0].trim();
if (!sha) {
  console.error(`Could not resolve ref ${branch} for ${repo}`);
  process.exit(1);
}

config.waha.dashboard.ref = sha;
fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2) + '\n', 'utf8');
console.log(`Updated ${CONFIG_FILE}: dashboard.ref = ${sha}`);

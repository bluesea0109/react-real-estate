#!/usr/bin/env node
'use strict';

const util = require('util');
const exec = util.promisify(require('child_process').exec);
const spawn = require('child_process').spawnSync;

async function version(versionType) {
  const { stdout, stderr } = await exec(`npm version ${versionType} --no-git-tag-version --force`);
  if (stderr) throw stderr;
  return stdout;
}

const run = async () => {
  try {
    const versionType = process.argv[2];
    const gitMessage = process.argv[3];

    const npmVersion = await version(versionType);
    await spawn('git', ['add', 'package.json'], { stdio: 'inherit' });
    await spawn('git', ['commit', '-m', `"${gitMessage}"`], { stdio: 'inherit' });
    await spawn('git', ['tag', npmVersion.trim()], { stdio: 'inherit' });
    // await spawn('git', ['status'], { stdio: 'inherit' });

  } catch (err) {
    console.log('Something went wrong:');
    console.error(err);
  }
};

run();

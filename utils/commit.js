#!/usr/bin/env node
'use strict';

const util = require('util');
const exec = util.promisify(require('child_process').exec);
const spawn = util.promisify(require('child_process').spawn);

async function version(versionType) {
  const { stdout, stderr } = await exec(`npm version ${versionType} --no-git-tag-version --force`);
  if (stderr) throw stderr;
  return stdout;
}

async function add() {
  const { stderr } = await spawn('git', ['add', 'package.json'], { stdio: 'inherit' });
  if (stderr) throw stderr;
}

async function commit(gitMessage) {
  const { stderr } = await spawn('git', ['commit', '-m', `"${gitMessage}"`], { stdio: 'inherit' });
  if (stderr) throw stderr;
}

async function tag(npmVersion) {
  const { stderr } = await spawn('git', ['tag', `${npmVersion}`], { stdio: 'inherit' });
  if (stderr) throw stderr;
}

async function status() {
  const { stderr } = await spawn('git', ['status'], { stdio: 'inherit' });
  if (stderr) throw stderr;
}

const run = async () => {
  try {
    const versionType = process.argv[2];
    const gitMessage = process.argv[3];

    const npmVersion = await version(versionType);
    await add();
    await commit(gitMessage);
    await tag(npmVersion);
    await status();

  } catch (err) {
    console.log('Something went wrong:');
    console.error(err);
  }
};

run();

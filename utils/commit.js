#!/usr/bin/env node
'use strict';

const util = require('util');
const exec = util.promisify(require('child_process').exec);

const run = async () => {
  try {
    const versionType = process.argv[2];
    const gitMessage = process.argv[3];

    const { stdout, stderr } = await exec(`npm version ${versionType} --no-git-tag-version --force`);
    if (stderr) throw stderr;

    const response = await exec(`git commit -m "${gitMessage}" && git tag ${stdout} && git status`);

    console.log('response', response);

  } catch (err) {
    console.log('Something went wrong:');
    console.error(err);
  }
};

run();

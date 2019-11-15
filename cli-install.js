#!/usr/bin/env node
'use strict';

require('events').EventEmitter.defaultMaxListeners = 50;

const child_process = require('child_process');

child_process.execSync("npm install",{stdio:[0,1,2]});

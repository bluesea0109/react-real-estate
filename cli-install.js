#!/usr/bin/env node
'use strict';

require('events').EventEmitter.prototype._maxListeners = 0;

const child_process = require('child_process');

child_process.execSync("npm install",{stdio:[0,1,2]});

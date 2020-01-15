#!/usr/bin/env node
'use strict';

require('events').EventEmitter.defaultMaxListeners = 50;

const rp = require('request-promise');

const source = 'alf-dev-initial-test';
const db = 'alf-dev';
const couch = `http://internal:XJxPX26iJ9UHFvZg0aq4@localhost:5984`;
const url = `${couch}/${db}`;

const run = async () => {
  try {

    const options = {
      url, method: 'DELETE', json: true
    };

    const deleteDB = await rp(options);
    console.log('Delete DB successful');
    console.log(deleteDB);

    const options2 = {
      url: `${couch}/_replicate`,
      body: {
        source,
        target: db,
        create_target: true
      },
      method: 'POST',
      json: true,
    };

    const replicateDB = await rp(options2);
    console.log('Replicate DB successful');
    console.log(replicateDB);

  } catch (err) {
    console.log('Error:');
    console.error(err.message);
    console.error(err.options);
  }
};

run();

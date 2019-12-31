#!/usr/bin/env node
'use strict';

require('events').EventEmitter.defaultMaxListeners = 50;

const rp = require('request-promise');
let user;
const campaignAPIEndPoint = 'http://alf-api-dev-1239229468.us-east-1.elb.amazonaws.com';
const campaignURL = (userId) => `${campaignAPIEndPoint}/api/user/${userId}/listing/mailout/initial?skipEmailNotification=true`;

async function createCampaigns() {
  try {
    const options = {
      method: 'POST',
      uri: campaignURL(user),
      json: true
    };

    const createCampaigns = await rp(options);
    console.log('Create Campaigns successful');
    console.log(createCampaigns);

  } catch (err) {
    err.message = `Something went horribly wrong during creating campaigns`;
    throw err;
  }
}

const run = async () => {
  try {

    if (!process.argv[2]) throw new Error('Please provide userId');

    await createCampaigns();

  } catch (err) {
    console.log();
    console.log();
    console.log();
    console.log(`   Error: ${err.message}`);
    console.log(`   ${err.options.method} ${err.options.uri}`);
    console.error(`   ${err.name} [${err.statusCode}] ${err.error.error}: ${err.error.reason}`);
  }
};

run();

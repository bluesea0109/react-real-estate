#!/usr/bin/env node
'use strict';

require('events').EventEmitter.defaultMaxListeners = 50;

const rp = require('request-promise');
const dbURL = 'http://sofa.rmcloud.com:5984';
const dbName = 'alf-dev';
let user;
let team;
const campaignAPIEndPoint = 'http://alf-api-dev-1239229468.us-east-1.elb.amazonaws.com';
const campaignURL = (userId) => `${campaignAPIEndPoint}/api/user/${userId}/listing/mailout/initial?skipEmailNotification=true`;

async function getUserProfile() {
  try {
    const userProfile = await rp(`${dbURL}/${dbName}/${user}`);
    const parsedUserProfile = await JSON.parse(userProfile);
    const { _id, _rev, type, mode, signupDate,
      auth0: { tenant, email, emailVerified, id }
    } = parsedUserProfile;

    console.log('userProfile');
    console.log('_id                 :',_id );
    console.log('_rev                :', _rev);
    console.log('type                :', type);
    console.log('mode                :', mode);
    console.log('signupDate          :', signupDate);
    console.log('auth0');
    console.log('      tenant        :', tenant);
    console.log('      email         :', email);
    console.log('      emailVerified :', emailVerified);
    console.log('      id            :', id);

    return parsedUserProfile;

  } catch (err) {
    err.message = `Something went horribly wrong during getting userProfile`;
    throw err;
  }
}

async function getUserProfile2() {
  try {
    const userProfile2 = await rp(`${dbURL}/${dbName}/alf|branding|${user}|profile`);
    const parsedUserProfile2 = await JSON.parse(userProfile2);
    const { _id, _rev, teamId, first, last, email, phone,
      brivitySync: { uuid, owner, role, updated_at_all_objects_utc, emailClicked }
    } = parsedUserProfile2;

    console.log('userProfile2');
    console.log('_id                          :',_id );
    console.log('_rev                         :', _rev);
    console.log('first                        :',first );
    console.log('last                         :', last);
    console.log('email                        :', email);
    console.log('phone                        :', phone);
    console.log('teamId                       :', teamId);
    console.log('brivitySync');
    console.log('  uuid                       :', uuid);
    console.log('  owner                      :', owner);
    console.log('  role                       :', role);
    console.log('  updated_at_all_objects_utc :', updated_at_all_objects_utc);
    console.log('  emailClicked               :', emailClicked);

    return parsedUserProfile2;

  } catch (err) {
    err.message = `Something went horribly wrong during getting userProfile2`;
    throw err;
  }
}

async function updateUserProfile(payload) {
  try {
    const options = {
      method: 'PUT',
      uri: `${dbURL}/${dbName}/${user}`,
      body: payload,
      json: true
    };

    const userProfile = await rp(options);
    console.log('UserProfile Update successful');
    console.log(userProfile);

  } catch (err) {
    err.message = `Something went horribly wrong during updating userProfile`;
    throw err;
  }
}

async function updateUserProfile2(payload) {
  try {
    const options = {
      method: 'PUT',
      uri: `${dbURL}/${dbName}/alf|branding|${user}|profile`,
      body: payload,
      json: true
    };

    const userProfile2 = await rp(options);
    console.log('UserProfile2 Update successful');
    console.log(userProfile2);

  } catch (err) {
    err.message = `Something went horribly wrong during updating userProfile2`;
    throw err;
  }
}

async function deleteCustomization() {
  try {
    const options = {
      method: 'DELETE',
      uri: `${dbURL}/${dbName}/alf|branding|${user}|branding`,
      json: true
    };

    const deleteCustomization = await rp(options);
    console.log('Delete Customization successful');
    console.log(deleteCustomization);

  } catch (err) {
    err.message = `Something went horribly wrong during deleting customization`;
    throw err;
  }
}

async function deleteTeamCustomization() {
  try {
    const options = {
      method: 'DELETE',
      uri: `${dbURL}/${dbName}/alf|branding|${team}|branding`,
      json: true
    };

    const deleteTeamCustomization = await rp(options);
    console.log('Delete Team Customization successful');
    console.log(deleteTeamCustomization);

  } catch (err) {
    err.message = `Something went horribly wrong during deleting team customization`;
    throw err;
  }
}

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

    if (process.argv[3]) team = process.argv[3];

    user = process.argv[2];

    const newUserProfile = await getUserProfile();
    delete newUserProfile.auth0.id;

    await updateUserProfile(newUserProfile);

    const newUserProfile2 = await getUserProfile2();
    delete newUserProfile2.brivitySync.emailClicked;
    delete newUserProfile2.brivitySync.emailInviteSent;

    await updateUserProfile2(newUserProfile2);

    await deleteCustomization();

    if (team) await deleteTeamCustomization();

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

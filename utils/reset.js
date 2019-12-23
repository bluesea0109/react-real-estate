#!/usr/bin/env node
'use strict';

require('events').EventEmitter.defaultMaxListeners = 50;

const rp = require('request-promise');
const dbURL = 'http://sofa.rmcloud.com:5984';
const dbName = 'alf-dev';
const user = 'brivity-ea801818-ff5c-4c76-ba67-b47ea34f3b66';

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

const run = async () => {
  try {

    const newUserProfile = await getUserProfile();
    delete newUserProfile.auth0.id;

    await updateUserProfile(newUserProfile);

    const newUserProfile2 = await getUserProfile2();
    delete newUserProfile2.brivitySync.emailClicked;
    delete newUserProfile2.brivitySync.emailInviteSent;

    await updateUserProfile2(newUserProfile2);

  } catch (err) {
    console.log('There was an error: ');
    console.error(err);
  }
};

run();

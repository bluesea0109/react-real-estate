#!/usr/bin/env node
'use strict';

require('events').EventEmitter.defaultMaxListeners = 50;

const jsf = require('json-schema-faker');
const convert = require('joi-to-json-schema');
const alfCommonsMailoutSchema = require('alf-commons/lib/schemas/mailout');

const generateMultiples = (schema, times) => {
  return jsf.generate({
    "type": "array",
    "minItems": times,
    "maxItems": times,
    "items": JSON.parse(schema)
  });
};

const replaceKeyValueInObjectString = (objStr, arr) => {
  const stringifiedObject = JSON.stringify(objStr);
  let newString;

  for (const keyValueSet of arr) {
    const keyName = Object.keys(keyValueSet)[0];
    const keyValue = keyValueSet[keyName];

    const target = new RegExp(`"${keyName}":"(.*?)"`, 'g');
    const replacement = `"${keyName}": "${keyValue}"`;
    newString = newString ? newString.replace(target, replacement) : stringifiedObject.replace(target, replacement);
  }

  return JSON.parse(newString);
};

const run = async () => {
  try {

    const mailoutSchema = await JSON.stringify(convert(alfCommonsMailoutSchema));

    console.log('mailoutSchema', mailoutSchema);

    const multipleMailouts = generateMultiples(mailoutSchema, 10);

    const newMultipleMailouts = await replaceKeyValueInObjectString(multipleMailouts, [
      { userId: 'Bartekus' },
      { mlsNum: 'Acme Inc.' }
      ]);

    console.log('newMultipleMailouts', newMultipleMailouts);

  } catch (err) {
    console.log('There was an error: ');
    console.error(err);
  }
};

run();

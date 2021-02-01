import _ from 'lodash';
import React from 'react';
import { Popup } from '.././Base';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

export const popup = msg => (
  <Popup
    flowing
    trigger={<FontAwesomeIcon icon="info-circle" style={{ color: '#2DB5AD' }} />}
    content={msg}
    position="top right"
  />
);

export const tag = type => {
  const types = {
    Required: (
      <span style={{ fontWeight: 700 }}>
        (Required)<span style={{ margin: '-.2em 0 0 .2em', color: '#db2828' }}>*</span>
      </span>
    ),
    Optional: <span style={{ fontWeight: 700 }}>(Optional)</span>,
    Dre: <span style={{ fontWeight: 700 }}>(Required in California)</span>,
    undefined: <span> </span>,
  };
  return type ? types[type] : types['undefined'];
};

export const phoneRegExp = /^(\+?\d{0,4})?\s?[-.]?\s?(\(?\d{3}\)?)\s?[-.]?\s?(\(?\d{3}\)?)\s?[-.]?\s?(\(?\d{4}\)?)?$/;
export const urlRegExp = new RegExp(
  '^(https?:\\/\\/)?' + // protocol
  '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
  '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
  '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
  '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
    '(\\#[-a-z\\d_]*)?$',
  'i'
); // fragment locator
export const keywordRegExp = /^[a-zA-Z0-9_]+$/;

export const required = value => (value ? undefined : 'Required');
export const isEmpty = value => value === undefined || value === null || value === '';
export const minLength = min => value =>
  !isEmpty(value) && value.length < min && `Must be at least ${min} characters`;
export const maxLength = max => value =>
  !isEmpty(value) && value.length > max && `Must be no more than ${max} characters`;
export const composeValidators = (...validators) => value =>
  validators.reduce((error, validator) => error || validator(value), undefined);

export const TrimStrAndConvertToInt = value => Math.round(parseInt(value.trim(), 10) / 10) * 10;

export function objectIsEmpty(obj) {
  return !obj || Object.keys(obj).length === 0;
}

export function differenceObjectDeep(source, other) {
  return _.reduce(
    source,
    function(result, value, key) {
      if (_.isObject(value) && _.isObject(other[key])) {
        result[key] = differenceObjectDeep(value, other[key]);
      } else if (!_.isEqual(value, other[key])) {
        result[key] = other[key];
      }
      return result;
    },
    _.omit(other, _.keys(source))
  );
}

export const postcardDimensions = size => {
  let dimension = '';
  switch (size) {
    case '4x6':
    case '6x4':
      dimension = '6x4';
      break;
    case '6x9':
    case '9x6':
      dimension = '9x6';
      break;
    case '6x11':
    case '11x6':
      dimension = '11x6';
      break;
    default:
  }
  return dimension;
};

export const postcardDimensionsDisplayed = size => {
  let dimension = '';
  switch (size) {
    case '4x6':
    case '6x4':
      dimension = '4x6';
      break;
    case '6x9':
    case '9x6':
      dimension = '6x9';
      break;
    case '6x11':
    case '11x6':
      dimension = '6x11';
      break;
    default:
  }
  return dimension;
};

export const iframeDimensions = size => {
  let width = 600;
  let height = 408;
  const formattedSize = postcardDimensions(size);

  if (formattedSize === '9x6') {
    width = 888;
    height = 600;
  }
  if (formattedSize === '11x6') {
    width = 1080;
    height = 600;
  }
  return { width, height };
};

export const strippedKWKLY = kwklyString => {
  return kwklyString
    .replace(/Text /g, '')
    .replace(/ to 59559 for details!/g, '')
    .trim();
};

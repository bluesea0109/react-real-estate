// import * as isInt from 'validator/lib/isInt';
import * as isURL from 'validator/lib/isURL';
import * as isEmail from 'validator/lib/isEmail';

// export const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

const isEmpty = value => value === undefined || value === null || value === '';
export const email = value => !isEmpty(value) && !isEmail(value) && 'Invalid email address';
export const required = value => isEmpty(value) && 'Required field';
export const requiredOnlyInCalifornia = (value, condition) => {
  if (condition && condition.state === 'California') {
    return value ? undefined : 'Required by state of California';
  }
  return undefined;
};
export const url = value => !isEmpty(value) && !isURL(value) && 'Invalid URL';

// export const minLength = min => value => !isEmpty(value) && value.length < min && `Must be at least ${min} characters`;
// export const maxLength = max => value => !isEmpty(value) && value.length > max && `Must be no more than ${max} characters`;
// export const integer = value => !isInt(value) && 'Must be an integer';
// export const mustBeNumber = value => (isNaN(value) ? 'Must be a number' : undefined);
// export const minValue = min => value => (isNaN(value) || value >= min ? undefined : `Should be greater than ${min}`);
export const composeValidators = (...validators) => value => validators.reduce((error, validator) => error || validator(value), undefined);

const mql = window.matchMedia('(max-width: 599px)');
export const isMobile = () => mql.matches;

// composeValidators(required, mustBeNumber, minValue(18))

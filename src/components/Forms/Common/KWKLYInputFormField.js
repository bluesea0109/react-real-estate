import React from 'react';
import { Label } from 'semantic-ui-react';

import { composeValidators, keywordRegExp, maxLength, minLength, popup, required } from '../../utils';
import { Input } from '../Base';

const validKeyword = str => !keywordRegExp.test(str) && 'KEYWORD is not valid';
const isNotDefaultKeyword = str => str.toLowerCase() === 'keyword' && 'Please replace KEYWORD with other phrase';

const KWKLYInputFormField = ({ listingType, formValues, setFormValues }) => {
  const ctaEnabled = formValues[listingType].shortenCTA;

  const handleKwklyChange = input => {
    const newValue = formValues;
    newValue[listingType].kwkly = input.target.value;
    setFormValues(newValue);
  };

  return (
    <Input
      label="KWKLY Call to Action Phrase"
      name={listingType + '_kwkly'}
      onBlur={handleKwklyChange}
      validate={!ctaEnabled && composeValidators(required, validKeyword, isNotDefaultKeyword, minLength(2), maxLength(40))}
      disabled={ctaEnabled}
      labelPosition="right"
      type="text"
      placeholder="KEYWORD"
      tag={popup('Please enter your KWKLY keyword and we will put the keyword into a the KWKLY phrase for you.')}
    >
      <Label style={{ opacity: !ctaEnabled ? '1' : '0.4' }}>Text </Label>
      <input />
      <Label style={{ opacity: !ctaEnabled ? '1' : '0.4' }}> to 59559 for details!</Label>
    </Input>
  );
};

export default KWKLYInputFormField;

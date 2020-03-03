import React from 'react';
import { Label } from 'semantic-ui-react';

import { composeValidators, keywordRegExp, maxLength, minLength, popup, required } from '../../utils';
import { Input } from '../Base';

const validKeyword = str => !keywordRegExp.test(str) && 'KEYWORD is not valid';
const isNotDefaultKeyword = str => str.toLowerCase() === 'keyword' && 'Please replace KEYWORD with other phrase';

const NEW_LISTING = 'listed';

const KWKLYInputFormField = ({ listingType, initialValues, formValues, setFormValues }) => {
  const editable = listingType === NEW_LISTING ? formValues && formValues.listed : formValues && formValues.sold;
  const ctaEnabled = editable ? formValues?.[listingType]?.shortenCTA : initialValues?.[listingType]?.shortenCTA;
  let currentValue = editable ? formValues?.[listingType]?.kwkly : initialValues?.[listingType]?.kwkly;

  if (currentValue && currentValue.includes('to 59559 for details!')) {
    currentValue = currentValue.split(' ')[1];
  }

  if (formValues?.[listingType]?.kwkly?.includes('to 59559 for details!')) {
    // We probably should not be doing this, since mutating a state value directly is a no-no
    formValues[listingType].kwkly = formValues[listingType].kwkly.split(' ')[1];
  }

  const handleKwklyChange = input => {
    const newValue = Object.assign({}, formValues);
    newValue[listingType].kwkly = input.target.value;
    setFormValues(newValue);
  };

  if (!editable) {
    return (
      <Input
        label="KWKLY Call to Action Phrase"
        name={listingType + '_kwkly'}
        value={currentValue}
        disabled={true}
        labelPosition="right"
        type="text"
        placeholder="KEYWORD"
        tag={popup('Please enter your KWKLY keyword and we will put the keyword into a the KWKLY phrase for you.')}
      >
        <Label style={{ opacity: 0.4 }}>Text </Label>
        <input />
        <Label style={{ opacity: 0.4 }}> to 59559 for details!</Label>
      </Input>
    );
  } else {
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
  }
};

export default KWKLYInputFormField;

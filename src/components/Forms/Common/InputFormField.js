import React from 'react';

import { composeValidators, maxLength, minLength, required } from '../../utils';
import { Input } from '../Base';

const InputFormField = ({ fieldName, listingType, formValues, setFormValues }) => {
  const adjustedName = fieldName === 'frontHeadline' ? 'Headline' : fieldName;

  const handleChange = input => {
    const newValue = formValues;
    newValue[listingType][fieldName] = input.target.value;
    setFormValues(newValue);
  };

  return (
    <Input
      label={adjustedName}
      name={listingType + '_frontHeadline'}
      onBlur={handleChange}
      validate={composeValidators(required, minLength(2), maxLength(15))}
    />
  );
};

export default InputFormField;

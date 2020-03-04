import React from 'react';

import { composeValidators, maxLength, minLength, required } from '../../utils';
import { Input } from '../Base';

const NEW_LISTING = 'listed';

const InputFormField = ({ fieldName, listingType, initialValues, formValues, setFormValues }) => {
  const currentValue = (formValues && formValues[listingType]?.[fieldName]) || initialValues[listingType][fieldName];
  const editable = listingType === NEW_LISTING ? !!formValues?.listed : !!formValues?.sold;

  const adjustedName = fieldName === 'frontHeadline' ? 'Headline' : fieldName;

  const handleChange = input => {
    const newValue = Object.assign({}, formValues);
    newValue[listingType][fieldName] = input.target.value;
    setFormValues(newValue);
  };

  if (!editable) {
    return <Input label={adjustedName} name={listingType + '_frontHeadline'} value={currentValue} disabled={true} />;
  } else {
    return (
      <Input
        label={adjustedName}
        name={listingType + '_frontHeadline'}
        onBlur={handleChange}
        validate={composeValidators(required, minLength(2), maxLength(15))}
      />
    );
  }
};

export default InputFormField;

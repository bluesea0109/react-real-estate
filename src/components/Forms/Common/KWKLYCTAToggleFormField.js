import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { Form } from '../Base';

const KWKLYCTAToggleFormField = ({ listingType, formValues, setFormValues }) => {
  const ctaEnabled = formValues[listingType].shortenCTA;

  const handleKwklyEnabledChange = () => {
    const newValue = formValues;
    newValue[listingType].shortenCTA = !ctaEnabled;
    setFormValues(newValue);
  };

  return (
    <Form.Field>
      {!ctaEnabled ? (
        <span style={{ verticalAlign: '-0.35em', color: '#59C4C4' }} onClick={handleKwklyEnabledChange}>
          <FontAwesomeIcon icon="toggle-on" size="2x" />
        </span>
      ) : (
        <span style={{ verticalAlign: '-0.35em', color: '#969696' }} onClick={handleKwklyEnabledChange}>
          <FontAwesomeIcon icon="toggle-on" size="2x" className="fa-flip-horizontal" />
        </span>
      )}
      &nbsp;
      {!ctaEnabled ? 'Disable Kwkly' : 'Enable Kwkly'}
    </Form.Field>
  );
};

export default KWKLYCTAToggleFormField;

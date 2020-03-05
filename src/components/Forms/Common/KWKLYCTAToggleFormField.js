import React from 'react';

import { Toggle } from '../Base';

const NEW_LISTING = 'listed';

const KWKLYCTAToggleFormField = ({ listingType, initialValues, formValues, setFormValues }) => {
  const editable = listingType === NEW_LISTING ? !!formValues?.listed : !!formValues?.sold;
  const ctaEnabled = editable ? formValues?.[listingType]?.shortenCTA : initialValues?.[listingType]?.shortenCTA;

  const handleKwklyEnabledChange = () => {
    const newValue = Object.assign({}, formValues);
    newValue[listingType].shortenCTA = !newValue[listingType].shortenCTA;
    setFormValues(newValue);
  };

  if (!editable) {
    return (
      <Toggle
        defaultChecked={ctaEnabled}
        label={ctaEnabled ? 'Enable Kwkly' : 'Disable Kwkly'}
        name={listingType + '_shortenCTA'}
        disabled={true}
        invertInput={true}
      />
    );
  } else {
    return (
      <Toggle label={ctaEnabled ? 'Enable Kwkly' : 'Disable Kwkly'} name={listingType + '_shortenCTA'} onChange={handleKwklyEnabledChange} invertInput={true} />
    );
  }
};

export default KWKLYCTAToggleFormField;

import React from 'react';
import { BlockPicker } from 'react-color';

import { colors } from '../../helpers';
import { Header } from 'semantic-ui-react';

const NEW_LISTING = 'listed';

const ColorPickerFormField = ({ listingType, initialValues, formValues, setFormValues }) => {
  const currentValue = (formValues && formValues[listingType]?.brandColor) || initialValues[listingType].brandColor;
  const editable = listingType === NEW_LISTING ? !!formValues?.listed : !!formValues?.sold;

  const handleColorChange = value => {
    const newValue = Object.assign({}, formValues);
    newValue[listingType].brandColor = value.hex;
    setFormValues(newValue);
  };

  if (!editable) {
    return (
      <div style={{ opacity: '0.4' }}>
        <Header as="h5">Brand Color</Header>
        <BlockPicker triangle="hide" width="200px" color={currentValue} colors={colors} />
      </div>
    );
  } else {
    return (
      <div>
        <Header as="h5">Brand Color</Header>
        <BlockPicker triangle="hide" width="200px" color={currentValue} colors={colors} onChangeComplete={handleColorChange} />
      </div>
    );
  }
};

export default ColorPickerFormField;

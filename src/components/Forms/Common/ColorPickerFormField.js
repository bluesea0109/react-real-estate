import React from 'react';
import { BlockPicker } from 'react-color';

import { colors } from '../../helpers';

const ColorPickerFormField = ({ listingType, formValues, setFormValues }) => {
  const currentValue = formValues[listingType].brandColor;

  const handleColorChange = value => {
    const newValue = formValues;
    newValue[listingType].brandColor = value.hex;
    setFormValues(newValue);
  };

  return <BlockPicker triangle="hide" width="200px" color={currentValue} colors={colors} onChangeComplete={handleColorChange} />;
};

export default ColorPickerFormField;

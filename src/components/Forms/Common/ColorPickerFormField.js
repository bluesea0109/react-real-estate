import React, { useState } from 'react';
import { BlockPicker, ChromePicker } from 'react-color';

import { colors } from '../../helpers';
import { Header, Icon } from 'semantic-ui-react';

const NEW_LISTING = 'listed';

const ColorPickerFormField = ({ listingType, initialValues, formValues, setFormValues }) => {
  const currentValue = (formValues && formValues[listingType]?.brandColor) || initialValues[listingType].brandColor;
  const editable = listingType === NEW_LISTING ? !!formValues?.listed : !!formValues?.sold;

  const [displayColorPicker, setDisplayColorPicker] = useState(false)
  const [tempColor, setTempColor] = useState(currentValue)

  const handleClick = () => setDisplayColorPicker(!displayColorPicker)
  const handleClose = () => {
    setDisplayColorPicker(false)
    const newValue = Object.assign({}, formValues);
    newValue[listingType].brandColor = tempColor.hex;
    setFormValues(newValue);
  }

  const handleColorChange = value => {
    const newValue = Object.assign({}, formValues);
    setTempColor(value)
    newValue[listingType].brandColor = value.hex;
    setFormValues(newValue);
  };

  const popover = {
    position: 'absolute',
    zIndex: '11',
    top: '125px'
  }
  const cover = {
    position: 'fixed',
    top: '0px',
    right: '0px',
    bottom: '0px',
    left: '0px',
  }

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
        <Icon id="brandColourPickerIcon" bordered link name="eye dropper" onClick={ handleClick } />
        { displayColorPicker ? <div style={ popover }>
            <div style={ cover } onClick={ handleClose } />
            <ChromePicker color={tempColor} onChange={value => setTempColor(value)} />
          </div> : null }
      </div>
    );
  }
};

export default ColorPickerFormField;

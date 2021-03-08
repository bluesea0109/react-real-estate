import React, { useState } from 'react';
import { SketchPicker } from 'react-color';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { Button, DropdownCard } from '../../components/Base';

const ColorPicker = styled(SketchPicker)`
  box-shadow: none !important;
  width: auto !important;
  padding: 0.5rem 0 !important;
  & > div:nth-child(3) {
    & > div > div {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      & > input {
        text-align: center;
      }
    }
  }
  & > div:nth-child(4) {
    border: none !important;
    justify-content: space-around;
    & > div {
      width: 31px !important;
      height: 31px !important;
    }
  }
`;

const presetColors = [
  '#B40100',
  '#F2724D',
  '#F5B450',
  '#79C44D',
  '#2D9A2D',
  '#59C4C4',
  '#009FE7',
  '#0E2B5B',
  '#EE83EE',
  '#8B288F',
  '#4A4A4A',
  '#808080',
];

export default function EditorTab({ colorPickerVal, setColorPickerVal, handleSave }) {
  const [brandColorOpen, setBrandColorOpen] = useState(true);
  const [postcardSizeOpen, setPostcardSizeOpen] = useState(false);
  const [photosOpen, setPhotosOpen] = useState(false);
  const [agentOpen, setAgentOpen] = useState(false);
  const onColorChange = color => setColorPickerVal(color);
  const brandColor = useSelector(state => state.mailout?.mailoutEdit?.brandColor);

  const changeSize = newSize => {
    handleSave(newSize);
  };

  return (
    <>
      <DropdownCard
        title="Brand Color"
        iconName="eye dropper"
        isOpen={brandColorOpen}
        setIsOpen={setBrandColorOpen}
      >
        <ColorPicker
          color={colorPickerVal?.hex || brandColor}
          onChange={onColorChange}
          disableAlpha
          presetColors={presetColors}
        />
      </DropdownCard>
      <DropdownCard
        title="Postcard Size"
        iconName="image outline"
        isOpen={postcardSizeOpen}
        setIsOpen={setPostcardSizeOpen}
      >
        <div>
          <Button primary onClick={() => changeSize('6x4')}>
            6x4
          </Button>
          <Button primary onClick={() => changeSize('9x6')}>
            6x9
          </Button>
          <Button primary onClick={() => changeSize('11x6')}>
            6x11
          </Button>
        </div>
      </DropdownCard>
      <DropdownCard title="Photos" iconName="images" isOpen={photosOpen} setIsOpen={setPhotosOpen}>
        <div>Photos</div>
      </DropdownCard>
      <DropdownCard
        title="Display Agent"
        iconName="user outline"
        isOpen={agentOpen}
        setIsOpen={setAgentOpen}
      >
        <div>Display Agent</div>
      </DropdownCard>
    </>
  );
}

import React, { useState } from 'react';
import { SketchPicker } from 'react-color';
import styled from 'styled-components';
import { DropdownCard } from '../../components/Base';

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

export default function EditorTab({ colorPickerVal, setColorPickerVal }) {
  const [openCard, setOpenCard] = useState('');
  const onColorChange = color => setColorPickerVal(color);
  return (
    <>
      <DropdownCard
        title="Brand Color"
        iconName="eye dropper"
        openCard={openCard}
        setOpenCard={setOpenCard}
      >
        <ColorPicker
          color={colorPickerVal?.hex}
          onChange={onColorChange}
          disableAlpha
          presetColors={presetColors}
        />
      </DropdownCard>
      <DropdownCard title="Photos" iconName="picture" openCard={openCard} setOpenCard={setOpenCard}>
        <div>Photos</div>
      </DropdownCard>
      <DropdownCard
        title="Display Agent"
        iconName="user outline"
        openCard={openCard}
        setOpenCard={setOpenCard}
      >
        <div>Display Agent</div>
      </DropdownCard>
    </>
  );
}

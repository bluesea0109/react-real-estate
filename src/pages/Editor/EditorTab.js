import React, { useState } from 'react';
import { SketchPicker } from 'react-color';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { DropdownCard } from '../../components/Base';
import DisplayAgent from './DisplayAgent';
import * as brandColors from '../../components/utils/brandColors';

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

const SizeButtons = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.5rem;
  & > button {
    background-color: transparent;
    width: 130px;
    padding: 0.5rem;
    border-radius: 8px;
    border: 1px solid ${brandColors.grey08};
    color: ${brandColors.grey03};
    font-size: 12px;
    font-weight: bold;
    &.selected {
      border-color: ${brandColors.grey03};
    }
    :not(:disabled) {
      cursor: pointer;
      :hover {
        border-color: ${brandColors.primary};
        color: ${brandColors.primary};
      }
    }
    :focus {
      outline: none;
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
  const [brandColorOpen, setBrandColorOpen] = useState(false);
  const [postcardSizeOpen, setPostcardSizeOpen] = useState(true);
  const [photosOpen, setPhotosOpen] = useState(false);
  const [agentOpen, setAgentOpen] = useState(false);
  const onColorChange = color => setColorPickerVal(color);
  const { brandColor, postcardSize } = useSelector(state => state.mailout?.mailoutEdit);
  const is6x4 = postcardSize === '6x4';
  const is9x6 = postcardSize === '9x6';
  const is11x6 = postcardSize === '11x6';
  const changeSize = newSize => {
    handleSave({ postcardSize: newSize });
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
        <SizeButtons>
          <button
            className={`${is6x4 ? 'selected' : ''}`}
            disabled={is6x4}
            onClick={() => changeSize('6x4')}
          >
            6" x 4"
          </button>
          <button
            className={`${is9x6 ? 'selected' : ''}`}
            disabled={is9x6}
            onClick={() => changeSize('9x6')}
          >
            6" x 9"
          </button>
          <button
            className={`${is11x6 ? 'selected' : ''}`}
            disabled={is11x6}
            onClick={() => changeSize('11x6')}
          >
            6" x 11"
          </button>
        </SizeButtons>
      </DropdownCard>
      <DropdownCard title="Photos" iconName="images" isOpen={photosOpen} setIsOpen={setPhotosOpen}>
        <div>Photos</div>
      </DropdownCard>
      <DropdownCard
        title="Display Agent"
        iconName="user circle"
        isOpen={agentOpen}
        setIsOpen={setAgentOpen}
      >
        <DisplayAgent handleSave={handleSave} />
      </DropdownCard>
    </>
  );
}

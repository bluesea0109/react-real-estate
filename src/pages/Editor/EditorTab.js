import React from 'react';
import { SketchPicker } from 'react-color';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { DropdownCard } from '../../components/Base';
import DisplayAgent from './DisplayAgent';
import * as brandColors from '../../components/utils/brandColors';
import CustomCTA from './CustomCTA';
import {
  setAgentOpen,
  setBrandColorOpen,
  setCustomCtaOpen,
  setPhotosOpen,
  setPostcardSizeOpen,
} from '../../store/modules/liveEditor/actions';
import PhotosCard from './PhotosCard';

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
      :hover,
      :focus {
        border-color: ${brandColors.primary};
        outline: none;
      }
      :hover {
        color: ${brandColors.primary};
      }
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

export default function EditorTab({
  colorPickerVal,
  customizeCTA,
  handleSave,
  invalidCTA,
  newCTA,
  setColorPickerVal,
  setCustomizeCTA,
  setInvalidCTA,
  setNewCTA,
}) {
  const dispatch = useDispatch();
  const details = useSelector(state => state.mailout?.details);
  const brandColorOpen = useSelector(state => state.liveEditor?.brandColorOpen);
  const postcardSizeOpen = useSelector(state => state.liveEditor?.postcardSizeOpen);
  const photosOpen = useSelector(state => state.liveEditor?.photosOpen);
  const agentOpen = useSelector(state => state.liveEditor?.agentOpen);
  const customCtaOpen = useSelector(state => state.liveEditor?.customCtaOpen);
  const onColorChange = color => setColorPickerVal(color);
  const brandColor = useSelector(state => state.mailout?.mailoutEdit?.brandColor);
  const postcardSize = useSelector(state => state.mailout?.mailoutEdit?.postcardSize);
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
        toggleOpen={() => dispatch(setBrandColorOpen(!brandColorOpen))}
      >
        <ColorPicker
          color={colorPickerVal?.hex || brandColor}
          onChange={onColorChange}
          disableAlpha
          presetColors={presetColors}
        />
      </DropdownCard>
      {!details?.frontResourceUrl && (
        <DropdownCard
          title="Postcard Size"
          iconName="expand"
          isOpen={postcardSizeOpen}
          toggleOpen={() => dispatch(setPostcardSizeOpen(!postcardSizeOpen))}
        >
          <SizeButtons>
            <button
              className={`${is6x4 ? 'selected' : ''}`}
              disabled={is6x4}
              onClick={() => changeSize('6x4')}
            >
              4" x 6"
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
      )}
      {details?.raw?.photos?.length && (
        <DropdownCard
          title="Cover Photo"
          iconName="images"
          isOpen={photosOpen}
          toggleOpen={() => dispatch(setPhotosOpen(!photosOpen))}
        >
          <PhotosCard handleSave={handleSave} />
        </DropdownCard>
      )}
      <DropdownCard
        title="Display Agent"
        iconName="user circle"
        isOpen={agentOpen}
        toggleOpen={() => dispatch(setAgentOpen(!agentOpen))}
      >
        <DisplayAgent handleSave={handleSave} />
      </DropdownCard>
      <DropdownCard
        title="Custom CTA"
        iconName="edit"
        isOpen={customCtaOpen}
        toggleOpen={() => dispatch(setCustomCtaOpen(!customCtaOpen))}
      >
        <CustomCTA
          customizeCTA={customizeCTA}
          setCustomizeCTA={setCustomizeCTA}
          newCTA={newCTA}
          invalidCTA={invalidCTA}
          setInvalidCTA={setInvalidCTA}
          setNewCTA={setNewCTA}
        />
      </DropdownCard>
    </>
  );
}

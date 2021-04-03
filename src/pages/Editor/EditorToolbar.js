import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { Dropdown, Icon, RangeInput } from '../../components/Base';
import {
  setFontSize,
  setFontStyle,
  setFontWeight,
  setRotation,
  setTextAlign,
  setTextDecoration,
  setZoomValue,
  updateElementCss,
} from '../../store/modules/liveEditor/actions';
import * as brandColors from '../../components/utils/brandColors';
import { ButtonNoStyle } from '../../components/Base';
import { Popup } from '../../components/Base';

export const StyledToolbar = styled.div`
  padding: 0 1rem;
  background-color: white;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  color: ${brandColors.grey03};
  > * {
    padding: 0.5rem 0;
  }
`;

const ZoomControls = styled.div`
  display: flex;
  align-items: center;
  margin: 0 1rem;
  & > i {
    font-size: 1.2rem;
  }
  & > span {
    font-weight: bold;
  }
`;

const TextEditMenu = styled.div`
  display: flex;
  align-items: center;
  > i {
    margin: 0 4px;
    padding: 16px;
    border-radius: 4px;
    font-size: 1.25rem;
    cursor: pointer;
    &.underline {
      transform: translateY(2px);
    }
    &.selected {
      background-color: ${brandColors.grey08};
    }
    &:hover {
      background-color: ${brandColors.grey09};
    }
  }
`;

const FontSizeMenu = styled.div`
  display: flex;
  margin: 0 0.75rem;
  > span {
    font-weight: bold;
  }
  > .ui.dropdown {
    margin-left: 0.5rem;
    display: flex;
    align-items: center;
  }
`;

const fontSizeOptions = [8, 10, 12, 16, 20, 24, 28, 32, 40, 48, 64, 96, 128];

const RotateButton = styled(ButtonNoStyle)`
  margin: 0;
  padding: 4px 8px;
`;

const styledRotate = {
  fontSize: '17px',
  color: `${brandColors.grey03}`,
  transform: 'scaleX(-1)',
};

export default function EditorToolbar() {
  const dispatch = useDispatch();
  const editingElement = useSelector(state => state.liveEditor?.editingElement);
  const zoomValue = useSelector(state => state.liveEditor?.zoomValue);
  const fontSize = useSelector(state => state.liveEditor?.fontSize);
  const textAlign = useSelector(state => state.liveEditor?.textAlign);
  const fontWeight = useSelector(state => state.liveEditor?.fontWeight);
  const fontStyle = useSelector(state => state.liveEditor?.fontStyle);
  const textDecoration = useSelector(state => state.liveEditor?.textDecoration);
  const rotation = useSelector(state => state.liveEditor?.rotation);

  const handleRotate = () => {
    let tempDegree = rotation;
    if (rotation <= -360) tempDegree = 0;
    let degree = tempDegree - 90;
    dispatch(setRotation(degree));
  };

  return (
    <StyledToolbar>
      <ZoomControls>
        <Icon name="zoom" />
        <RangeInput
          type="range"
          min="0.5"
          max="1.5"
          step="0.05"
          value={zoomValue}
          onChange={e => dispatch(setZoomValue(e.target.value))}
        />
        <span>{Math.round(zoomValue * 100)}%</span>
      </ZoomControls>
      <Popup
        content="Rotate Pages"
        inverted
        position="bottom left"
        on="hover"
        trigger={
          <RotateButton onClick={() => handleRotate()}>
            <Icon name="sync" style={styledRotate} />
          </RotateButton>
        }
      />
      {editingElement && (
        <TextEditMenu>
          <FontSizeMenu>
            <span>Font Size</span>
            <Dropdown
              options={fontSizeOptions.map(option => {
                return { key: option, text: option, value: option };
              })}
              value={fontSize}
              onChange={(e, { value }) => {
                dispatch(setFontSize(value));
                dispatch(updateElementCss({ property: 'font-size', value: `${value}px` }));
              }}
            />
          </FontSizeMenu>
          <Icon
            name="align left"
            className={textAlign === 'left' || textAlign === 'start' ? 'selected' : null}
            onClick={() => {
              dispatch(setTextAlign('left'));
              dispatch(updateElementCss({ property: 'text-align', value: 'left' }));
            }}
          />
          <Icon
            name="align center"
            className={textAlign === 'center' ? 'selected' : null}
            onClick={() => {
              dispatch(setTextAlign('center'));
              dispatch(updateElementCss({ property: 'text-align', value: 'center' }));
            }}
          />
          <Icon
            name="align right"
            className={textAlign === 'right' || textAlign === 'end' ? 'selected' : null}
            onClick={() => {
              dispatch(setTextAlign('right'));
              dispatch(updateElementCss({ property: 'text-align', value: 'right' }));
            }}
          />
          <Icon
            name="bold"
            className={fontWeight === 'bold' || fontWeight === '700' ? 'selected' : null}
            onClick={() => {
              const newValue = fontWeight === 'bold' || fontWeight === '700' ? 'normal' : 'bold';
              dispatch(setFontWeight(newValue));
              dispatch(
                updateElementCss({
                  property: 'font-weight',
                  value: newValue,
                })
              );
            }}
          />
          <Icon
            name="italic"
            className={fontStyle === 'italic' ? 'selected' : null}
            onClick={() => {
              const newValue = fontStyle === 'italic' ? 'none' : 'italic';
              dispatch(setFontStyle(newValue));
              dispatch(
                updateElementCss({
                  property: 'font-style',
                  value: newValue,
                })
              );
            }}
          />
          <Icon
            name="underline"
            className={textDecoration?.includes('underline') ? 'selected' : null}
            onClick={() => {
              const newValue = textDecoration?.includes('underline') ? 'none' : 'underline';
              dispatch(setTextDecoration(newValue));
              dispatch(updateElementCss({ property: 'text-decoration', value: newValue }));
            }}
          />
        </TextEditMenu>
      )}
    </StyledToolbar>
  );
}

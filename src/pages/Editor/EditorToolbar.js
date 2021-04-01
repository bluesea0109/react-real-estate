import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { Dropdown, Icon, RangeInput } from '../../components/Base';
import {
  setFontSize,
  setZoomValue,
  updateElementCss,
} from '../../store/modules/liveEditor/actions';
import * as brandColors from '../../components/utils/brandColors';

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

const fontSizeOptions = [
  { key: 1, text: '8', value: 8 },
  { key: 2, text: '10', value: 10 },
  { key: 3, text: '12', value: 12 },
  { key: 4, text: '16', value: 16 },
  { key: 5, text: '24', value: 24 },
  { key: 6, text: '32', value: 32 },
  { key: 7, text: '64', value: 64 },
];

export default function EditorToolbar() {
  const dispatch = useDispatch();
  const editingElement = useSelector(state => state.liveEditor?.editingElement);
  const zoomValue = useSelector(state => state.liveEditor?.zoomValue);
  const fontSize = useSelector(state => state.liveEditor?.fontSize);
  const textAlign = useSelector(state => state.liveEditor?.textAlign);
  const fontWeight = useSelector(state => state.liveEditor?.fontWeight);
  const fontStyle = useSelector(state => state.liveEditor?.fontStyle);
  const textDecoration = useSelector(state => state.liveEditor?.textDecoration);
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
      {editingElement && (
        <TextEditMenu>
          <FontSizeMenu>
            <span>Font Size</span>
            <Dropdown
              options={fontSizeOptions}
              value={fontSize}
              onChange={(e, { value }) => {
                dispatch(setFontSize(value));
                dispatch(updateElementCss({ css: `font-size:${value}px` }));
              }}
            />
          </FontSizeMenu>
          <Icon name="align left" className={textAlign === 'left' ? 'selected' : null} />
          <Icon name="align center" className={textAlign === 'center' ? 'selected' : null} />
          <Icon name="align right" className={textAlign === 'right' ? 'selected' : null} />
          <Icon name="bold" className={fontWeight === 'bold' ? 'selected' : null} />
          <Icon name="italic" className={fontStyle === 'italic' ? 'selected' : null} />
          <Icon
            name="underline"
            className={textDecoration?.includes('underline') ? 'selected' : null}
          />
        </TextEditMenu>
      )}
    </StyledToolbar>
  );
}

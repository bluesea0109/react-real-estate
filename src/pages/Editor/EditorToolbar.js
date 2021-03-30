import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { Dropdown, Icon, RangeInput } from '../../components/Base';
import { setFontSizeValue, setZoomValue } from '../../store/modules/liveEditor/actions';
import * as brandColors from '../../components/utils/brandColors';

export const StyledToolbar = styled.div`
  padding: 0.5rem 1rem;
  background-color: white;
  display: flex;
  align-items: center;
  color: ${brandColors.grey03};
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

const FontSizeMenu = styled.div`
  display: flex;
  > span {
    font-weight: bold;
    margin-left: 1rem;
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
  const fontSizeValue = useSelector(state => state.liveEditor?.fontSizeValue);
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
        <FontSizeMenu>
          <span>Font Size</span>
          <Dropdown
            options={fontSizeOptions}
            value={fontSizeValue}
            onChange={(e, { value }) => dispatch(setFontSizeValue(value))}
          />
        </FontSizeMenu>
      )}
    </StyledToolbar>
  );
}

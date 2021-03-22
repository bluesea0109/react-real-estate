import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { Icon, RangeInput } from '../../components/Base';
import { setZoomValue } from '../../store/modules/liveEditor/actions';
import * as brandColors from '../../components/utils/brandColors';

export const StyledToolbar = styled.div`
  padding: 0.5rem 1rem;
  background-color: white;
  display: flex;
  align-items: center;
`;

const ZoomControls = styled.div`
  display: flex;
  align-items: center;
  color: ${brandColors.grey03};
  margin: 0 1rem;
  & > i {
    font-size: 1.2rem;
  }
  & > span {
    font-weight: bold;
  }
`;

export default function EditorToolbar() {
  const dispatch = useDispatch();
  const zoomValue = useSelector(state => state.liveEditor?.zoomValue);
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
    </StyledToolbar>
  );
}

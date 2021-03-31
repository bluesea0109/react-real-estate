import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { Icon, RangeInput } from '../../components/Base';
import { setZoomValue, setRotation } from '../../store/modules/liveEditor/actions';
import * as brandColors from '../../components/utils/brandColors';
import { ReactComponent as RotateIcon } from '../../assets/rotate-left.svg';
import { ButtonNoStyle } from '../../components/Base';

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

const RotateButton = styled(ButtonNoStyle)`
  height: 26px;
  padding: 0px 0px 0px 0px;
  width: 40px;
  min-width: 30px;

  & :hover {
    color: ${brandColors.brivityBlue};
  }
`;

const styledRotate = {
  fontSize: '17px',
  color: '#8a8a8a',
  webkitTransform: 'scaleX(-1)',
  transform: 'scaleX(-1)',
};

const Tooltip = styled.div`
  &[data-position='top left'][data-tooltip]:after {
    border-radius: 5px;
    background: #616161;
    top: -7px;
    left: 51px;
    bottom: -11px;
    height: auto;
    padding: 8px;
  }

  &[data-inverted][data-position~='top'][data-tooltip]:before {
    background: #616161;
  }

  &[data-position='top left'][data-tooltip]:before {
    bottom: 6px;
    left: 52px;
  }
  & p {
    width: 256px;
    padding-top: 1rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;

export default function EditorToolbar() {
  const dispatch = useDispatch();
  const zoomValue = useSelector(state => state.liveEditor?.zoomValue);
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
      <Tooltip data-tooltip="rotate" data-position="top left" data-inverted="">
        <RotateButton onClick={() => handleRotate()}>
          <RotateIcon style={styledRotate} />
        </RotateButton>
      </Tooltip>
    </StyledToolbar>
  );
}

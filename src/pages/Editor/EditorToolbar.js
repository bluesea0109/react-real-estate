import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { Icon, RangeInput } from '../../components/Base';
import { setZoomValue, setRotation } from '../../store/modules/liveEditor/actions';
import * as brandColors from '../../components/utils/brandColors';
import { ReactComponent as RotateIcon } from '../../assets/rotate-left.svg';

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

const styledRotate = {
  fontSize: '17px',
  marginTop: "15px",
  marginLeft: "20px",
  // display: "-webkit-box",
  //   display: "-webkit-flex",
  //   display: "-ms-flexbox",
  //   /* display: flex; */
  //   webkitAlignItems: "center",
  //   webkitBoxAlign: "center",
  //   msFlexAlign: "center",
  //   alignItems: "center",
  //   color: "#666666",
  //   margin: "0 1rem",
}



export default function EditorToolbar() {
  const dispatch = useDispatch();
  const zoomValue = useSelector(state => state.liveEditor?.zoomValue);
  const rotation = useSelector(state => state.liveEditor?.rotation);

  const handleRotate = () => {
    let tempDegree = rotation;
    if (rotation <= -360) tempDegree = 0
    let degree = tempDegree - 90
    dispatch(setRotation(degree))
  }

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
   
      <RotateIcon style={styledRotate} onClick={() => handleRotate()}/>
    
    </StyledToolbar>
  );
}

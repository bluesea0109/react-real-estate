import styled from 'styled-components';
import { iframeDimensions } from '../../components/utils/utils';

export const StyledFrame = styled.div`
  position: relative;
  box-sizing: border-box;
  width: ${props => iframeDimensions(props.postcardSize).width * props.scale}px;
  height: ${props => iframeDimensions(props.postcardSize).height * props.scale}px;
  & > .scale-wrapper {
    transform: scale(${props => props.scale});
    transform-origin: 0 0;
  
  }
  transform: rotate(${props => props.rotate})
`;

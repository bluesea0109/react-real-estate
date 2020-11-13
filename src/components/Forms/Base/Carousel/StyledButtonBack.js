import styled from 'styled-components';
import { ButtonBack } from 'pure-react-carousel';
import * as brandColors from '../../../utils/brandColors';

const StyledButtonBack = styled(ButtonBack)`
  width: 3em;
  height: 3em;
  border-radius: 3em;
  background-color: transparent;
  & i {
    margin: 0;
    transform: translateX(-1px);
  }
  &:hover {
    background-color: ${brandColors.lightGreyHover};
  }
`;

export default StyledButtonBack;

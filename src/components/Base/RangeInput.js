import styled from 'styled-components';
import * as brandColors from '../../components/utils/brandColors';

const RangeInput = styled.input`
  margin: 0 0.5rem;
  -webkit-appearance: none;
  background-color: ${brandColors.grey08};
  width: 120px;
  height: 10px;
  border-radius: 10px;
  :focus {
    outline: none;
  }
  ::-webkit-slider-thumb {
    -webkit-appearance: none;
    background-color: ${brandColors.primary};
    width: 20px;
    height: 20px;
    border-radius: 20px;
    cursor: pointer;
  }
`;

export default RangeInput;

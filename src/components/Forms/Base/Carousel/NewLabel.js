import styled from 'styled-components';
import * as brandColors from '../../../utils/brandColors';

const NewLabel = styled.div`
  max-width: 260px;
  margin: auto;
  padding: 0.5em 0;
  & .label {
    background-color: ${brandColors.secondary};
    border-radius: 500px;
    padding: 2px 12px;
    color: white;
    font-weight: bold;
    text-transform: uppercase;
  }
`;

export default NewLabel;

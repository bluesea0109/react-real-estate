import styled from 'styled-components';
import * as brandColors from '../../components/utils/brandColors';

export default styled.div`
  width: 256px;
  height: 176px;
  padding: 8px;
  border: ${props => (props.selected ? '2px solid ' + brandColors.primary : '1px solid #d3d3d3')};
  border-radius: 5px;
  margin: 1rem;
  box-shadow: ${brandColors.boxShadow};
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
`;

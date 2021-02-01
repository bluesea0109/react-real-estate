import styled from 'styled-components';
import * as brandColors from '../../components/utils/brandColors';

export const GridItem = styled.div`
  width: 256px;
  height: 176px;
  padding: 8px;
  border: ${props => (props.selected || props.error ? '2px solid' : '1px solid')};
  border-color: ${props =>
    props.selected ? brandColors.primary : props.error ? brandColors.error : '#d3d3d3'};
  border-radius: 5px;
  margin: 0.5rem 1rem;
  box-shadow: ${brandColors.boxShadow};
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const GridItemContainer = styled.div`
  display: flex;
  flex-direction: column;
  & .label-text {
    margin-left: 1.5rem;
    font-weight: ${props => (props.type === 'size' ? 400 : 600)};
    color: ${props => (props.selected ? brandColors.primary : brandColors.textDark)};
  }
`;

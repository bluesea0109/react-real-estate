import styled from 'styled-components';

const CSSGrid = styled.div.attrs(props => ({
  columns: props.columns || '50% 50%',
  gap: props.gap || '10px',
}))`
  display: grid;
  grid-template-columns: ${props => props.columns};
  grid-gap: ${props => props.gap};
`;

export default CSSGrid;

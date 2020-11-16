import styled from 'styled-components';

const StyledTemplateDiv = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 3fr) 1fr;
  @media screen and (max-width: 740px) {
    grid-template-columns: minmax(0, 1fr);
  }
`;

export default StyledTemplateDiv;

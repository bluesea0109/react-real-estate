import { Segment } from 'semantic-ui-react';
import styled from 'styled-components';

export default styled(Segment)`
  grid-area: itembody;

  display: grid;
  grid-template-rows: 1fr;
  grid-template-columns: [pictures] 1fr [data] 1fr;
  grid-template-areas: 'pictures data';

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    grid-template-areas:
      'pictures'
      'data';
  }
`;

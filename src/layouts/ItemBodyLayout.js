import { Segment } from 'semantic-ui-react';
import styled from 'styled-components';

export default styled(Segment)`
  grid-area: itembody;

  display: grid;
  grid-template-rows: 1fr;
  grid-template-columns: [pictures] 675px [data] 1fr;
  grid-template-areas: 'pictures data';

  @media (max-width: 1080px) {
    grid-template-columns: 1fr;
    grid-template-areas:
      'pictures'
      'data';
  }
`;

import { Segment } from 'semantic-ui-react';
import styled from 'styled-components';

export default styled(Segment)`
  grid-area: itembody;

  display: grid;
  grid-template-columns: 1fr;
  grid-template-areas:
    'data'
    'pictures';
`;

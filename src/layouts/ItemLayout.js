import { Container } from 'semantic-ui-react';
import styled from 'styled-components';

export default styled(Container)`
  display: grid;
  grid-template-rows: [itemheader] auto [itembody] auto;
  grid-template-columns: 1fr;
  grid-template-areas:
    'itemheader'
    'itembody';
`;

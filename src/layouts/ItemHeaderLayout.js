import { Header } from 'semantic-ui-react';
import styled from 'styled-components';

export default styled(Header)`
  grid-area: itemheader;

  display: grid !important;
  grid-template-rows: 1fr;
  grid-template-columns: [label] 75px [address] 6fr auto [menu] 4fr;
  grid-template-areas: 'label address . menu';

  @media (max-width: 768px) {
    grid-template-rows: 1fr 1fr;
    grid-template-columns: 1fr 1fr 1fr;
    grid-template-areas:
      'label menu menu'
      'address address address';
  }
`;
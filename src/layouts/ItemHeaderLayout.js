import { Header } from 'semantic-ui-react';
import styled from 'styled-components';

export default styled(Header)`
  font-family: 'Open Sans', sans-serif !important;

  grid-area: itemheader;

  display: grid !important;
  grid-template-rows: 1fr;
  grid-template-columns: [label] 75px [address] auto [menu] auto;
  grid-template-areas: 'label address . menu';

  @media (max-width: 768px) {
    grid-template-rows: 1fr 1fr;
    grid-template-columns: 1fr 1fr 1fr;
    grid-template-areas:
      'label menu menu'
      'address address address';
  }
`;

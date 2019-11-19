import { Header } from 'semantic-ui-react';
import styled from 'styled-components';

export default styled(Header)`
  display: grid !important;
  grid-template-rows: 1fr;
  grid-template-columns: [label] 1fr [address] 4fr auto [menu] 4fr;
  grid-template-areas: 'label address . menu';

  @media (max-width: 700px) {
    grid-template-rows: 1fr 1fr 1fr;
    grid-template-columns: 1fr 1fr 1fr;
    grid-template-areas:
      'label label label'
      'address address address'
      'menu menu menu';
  }
`;

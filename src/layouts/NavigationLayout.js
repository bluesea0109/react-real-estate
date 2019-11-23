import { Menu } from 'semantic-ui-react';
import styled from 'styled-components';

export default styled(Menu)`
  display: grid !important;
  grid-template-rows: 1fr 1fr 1fr 1fr 1fr;
  grid-template-columns: 1fr;

  height: 160px;

  @media (max-width: 768px) {
    grid-template-rows: 1fr;
    grid-template-columns: 1fr 1fr 1fr 1fr 1fr;

    height: 60px;
    margin: 0 !important;
  }
`;

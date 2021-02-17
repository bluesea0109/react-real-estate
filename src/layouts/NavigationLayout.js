import { Menu } from 'semantic-ui-react';
import styled from 'styled-components';

export default styled(Menu)`
  width: 225px;

  @media (max-width: 768px) {
    grid-template-rows: 1fr;
    grid-template-columns: repeat(6, 1fr);
    justify-content: space-between;

    height: 60px;
    margin: 0 !important;
  }
`;

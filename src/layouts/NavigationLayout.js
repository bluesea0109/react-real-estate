import { Menu } from 'semantic-ui-react';
import styled from 'styled-components';

export default styled(Menu)`
  display: grid !important;
  grid-template-rows: repeat(5, 1fr);
  grid-template-columns: 1fr;

  @media (max-width: 768px) {
    grid-template-rows: 1fr;
    grid-template-columns: repeat(6, 1fr);
    justify-content: space-between;

    height: 60px;
    margin: 0 !important;
  }
`;

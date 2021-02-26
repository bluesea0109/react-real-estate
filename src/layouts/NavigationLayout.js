import { Menu } from 'semantic-ui-react';
import styled from 'styled-components';

export default styled(Menu)`
  width: 225px;

  @media (max-width: 768px) {
    height: 60px;
    margin: 0 !important;
  }
`;

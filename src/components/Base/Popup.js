import { Popup } from 'semantic-ui-react';
import styled from 'styled-components';

export default styled(Popup)`
  &.ui.inverted.popup {
    background-color: #616161;
    left: -9px !important;
    ::before {
      background-color: #616161;
    }
  }
`;

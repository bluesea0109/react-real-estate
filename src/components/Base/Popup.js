import { Popup } from 'semantic-ui-react';
import styled from 'styled-components';
import * as brandColors from '../utils/brandColors';

export default styled(Popup)`
  &.ui.inverted.popup {
    background-color: ${brandColors.grey03};
    ::before {
      background-color: ${brandColors.grey03};
    }
  }
`;

import { Tab } from 'semantic-ui-react';
import styled from 'styled-components';
import * as brandColors from '../utils/brandColors';

export default styled(Tab)`
  &&& {
    &.menu {
      .active {
        background: none !important;
        color: ${brandColors.primary} !important;
        border-bottom: 3px solid ${brandColors.primary} !important;
      }
    }
  }
`;

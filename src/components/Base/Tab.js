import { Tab } from 'semantic-ui-react';
import styled from 'styled-components';
import * as brandColors from '../utils/brandColors';

export default styled(Tab)`
  &&& {
    .ui.secondary.pointing.menu .item {
      padding-left: 0px;
      padding-right: 0px;
      padding-bottom: 1.3em;
      font-weight: 600;
    }
    .ui.secondary.pointing.menu {
      margin-left: 0px;
      margin-right: 0px;
    }
    .ui.menu > .item:first-child {
      margin-left: 0px;
    }

    .ui.secondary.pointing.menu .active.item {
      color: ${brandColors.primary};
    }
  }
`;

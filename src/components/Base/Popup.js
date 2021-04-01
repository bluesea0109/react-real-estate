import { Popup } from 'semantic-ui-react';
import styled from 'styled-components';

export default styled(Popup)`
  &[data-position='top left'][data-tooltip]:after {
    border-radius: 5px;
    background: #616161;
    top: 34px;
    left: -27px;
    bottom: -49px;
    padding: 7px;
    height: auto;
  }

  &[data-inverted][data-position~='top'][data-tooltip]:before {
    background: #616161;
  }

  &[data-position='top left'][data-tooltip]:before {
    bottom: -17px;
    left: 20px;
  }
`;

import { Message } from 'semantic-ui-react';
import styled from 'styled-components';

export default styled(Message)`
  border-left: solid 3px;
  box-shadow: none;
  -webkit-box-shadow: none;
  border-radius: 0 !important;
  font-size: 1em;
  display: flex;
  align-items: center;
  &&& > .close.icon {
    position: initial;
    opacity: 1;
    margin-left: auto;
  }
`;

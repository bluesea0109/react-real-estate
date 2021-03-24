import { Modal } from 'semantic-ui-react';
import styled from 'styled-components';

export default styled(Modal)`
  &&& {
    margin: 0;
    width: auto;
    max-width: 90vw;
    padding: 30px;
  }
  .description {
    color: #686868;
  }
`;

import { Modal } from 'semantic-ui-react';
import styled from 'styled-components';

export default styled(Modal)`
  &&& {
    margin: 0;
    width: auto;
    padding: 23px 30px 30px;
    border-radius: 10px;
    background: white;
  }
  .description {
    color: #686868;
  }
`;

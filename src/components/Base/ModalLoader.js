import { Loader } from 'semantic-ui-react';
import styled from 'styled-components';

export default styled(Loader)`
  &&&& {
    color: rgba(0, 0, 0, 0.9);
    ::before {
      border-color: rgba(0, 0, 0, 0.1);
    }
    ::after {
      border-color: #767676 transparent transparent;
    }
  }
`;

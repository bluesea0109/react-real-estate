import { Step } from 'semantic-ui-react';
import styled from 'styled-components';

export default styled(Step)`
  display: inline-grid !important;

  @media (min-width: 10px) {
    padding-right: 0 !important;
    padding-left: 10px !important;

    grid-template-rows: 1fr;
    grid-template-columns: 30px 1fr;
    justify-items: left;
  }
`;

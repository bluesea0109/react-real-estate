import { Step } from 'semantic-ui-react';
import styled from 'styled-components';

export default styled(Step)`
  display: inline-grid !important;

  @media (min-width: 769px) {
    padding-right: 0 !important;
    padding-left: 10px !important;

    grid-template-rows: 1fr;
    grid-template-columns: 1fr 2fr;
  }
`;

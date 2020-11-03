import { Step } from 'semantic-ui-react';
import styled from 'styled-components';

export default styled(Step.Group)`
  display: grid !important;
  grid-template-rows: repeat(3, 1fr);
  grid-template-columns: 1fr;

  height: 160px;

  // @media (max-width: 768px) {
  //   grid-template-rows: 1fr;
  //   grid-template-columns: repeat(3, 1fr);

  //   height: 60px;
  //   margin: 0 !important;
  // }
`;

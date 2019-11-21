import { List } from 'semantic-ui-react';
import styled from 'styled-components';

export default styled(List)`
  grid-area: data;

  display: grid;
  grid-template-rows: 1fr;
  grid-template-columns: 1fr 1fr 1fr 1fr;

  @media (max-width: 768px) {
    grid-template-rows: 2fr;
    grid-template-columns: 1fr 1fr;
  }
`;

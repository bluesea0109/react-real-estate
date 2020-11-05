import { List } from 'semantic-ui-react';
import styled from 'styled-components';

export default styled(List)`
  grid-area: data;
  justify-items: start;

  display: grid;
  gap: 10px;
  grid-template-rows: 100px;
  grid-template-columns: repeat(auto-fit, minmax(141px, 1fr));
  justify-items: center;
`;

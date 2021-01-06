import { Header } from 'semantic-ui-react';
import styled from 'styled-components';
import * as brandColors from '../utils/brandColors';

export default styled(Header)`
  color: ${brandColors.textDark};
  font-weight: 600;
`;

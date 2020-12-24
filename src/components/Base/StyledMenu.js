import styled from 'styled-components';
import Menu from './Menu';
import * as brandColors from '../utils/brandColors';

export default styled(Menu)`
  flex-wrap: wrap;
  &&& .item {
    padding: 0.5rem;
  }
  &&& .secondary-heading {
    font-size: 1.25rem;
    color: ${brandColors.grey03};
  }
`;

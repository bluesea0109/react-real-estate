import styled from 'styled-components';

const StyledButtonBack = styled.div`
  z-index: 100;
  transform: translate(1.5rem, -2rem);
  &::before {
    opacity: 1;
    color: rgb(224, 225, 226);
    font-size: 2.75rem;
  }
  &:hover {
    &::before {
      color: lightgrey;
    }
  }
`;

export default StyledButtonBack;

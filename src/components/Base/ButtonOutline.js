import styled from 'styled-components';

const ButtonOutline = styled.button`
  height: 36px;
  background: transparent;
  padding: 0 1rem;
  border: none;
  font: inherit;
  font-size: 14px;
  font-weight: 600;
  color: white;
  cursor: pointer;
  border: 2px solid white;
  border-radius: 36px;
  &:focus {
    outline: none;
  }
`;

export default ButtonOutline;

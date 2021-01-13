import styled from 'styled-components';

const ButtonNoStyle = styled.button`
  background: transparent;
  padding: 0 1rem;
  border: none;
  font: inherit;
  font-size: 14px;
  font-weight: 600;
  color: white;
  cursor: pointer;
  border: none;
  &:focus {
    outline: none;
  }
`;

export default ButtonNoStyle;

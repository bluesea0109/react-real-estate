import styled from 'styled-components';

export default styled.div`
  grid-area: sidebar;
  position: fixed;
  top: 60px;
  z-index: 20;

  background-color: white;

  @media (max-width: 769px) {
    min-width: 100%;
  }
`;

import styled from 'styled-components';

export default styled.div`
  grid-area: sidebar;
  position: fixed;
  top: 60px;
  z-index: 20;

  border-right: 2px solid lightgrey;
  min-height: 100vh !important;

  @media (max-width: 769px) {
    min-width: 100%;
  }
`;

import styled from 'styled-components';

export default styled.div`
  grid-area: sidebar;
  position: fixed;
  top: 60px;
  z-index: 20;

  @media (min-width: 770px) {
    border-right: 1px solid lightgrey;
    min-height: 100vh !important;
    min-width: 174px;
  }

  @media (max-width: 769px) {
    min-width: 100%;
  }
`;

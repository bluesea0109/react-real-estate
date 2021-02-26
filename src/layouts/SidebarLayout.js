import styled from 'styled-components';

export default styled.div`
  grid-area: sidebar;
  position: fixed;
  top: 61px;
  z-index: 20;

  @media (min-width: 600px) {
    border-right: 1px solid lightgrey;
    min-height: 100vh !important;
    min-width: 56px;
  }

  @media (max-width: 599px) {
    min-width: 100%;
    background: #ffffff;
  }
`;

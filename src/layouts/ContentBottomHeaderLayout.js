import styled from 'styled-components';

export default styled.div`
  grid-area: content-bottom-header;
  min-height: 61px;
  position: fixed;
  min-width: calc(100% - 219px);
  top: 135px;
  z-index: 10;

  @media (max-width: 768px) {
    min-width: 92.5%;
    left: 13px;
  }
`;

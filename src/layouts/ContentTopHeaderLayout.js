import styled from 'styled-components';

export default styled.div`
  grid-area: content-top-header;
  min-height: 72px;
  min-width: calc(100% - 203px);
  position: fixed;
  top: 62px;
  z-index: 15;

  @media (max-width: 768px) {
    min-width: 92.5%;
  }
`;

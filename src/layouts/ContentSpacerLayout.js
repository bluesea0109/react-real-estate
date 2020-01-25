import styled from 'styled-components';

export default styled.div`
  grid-area: content-spacer;
  min-height: 20px;
  background-color: #f7f6f5;
  //background-color: #cc0000;

  margin-left: -1.2em;
  min-width: calc(100% - 172px);
  position: fixed;
  top: 136px;
  z-index: 5;

  @media (max-width: 768px) {
    top: 65px;
    min-width: 101%;
    min-height: 148px;
  }
`;

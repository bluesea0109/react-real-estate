import styled from 'styled-components';

export default styled.div`
  grid-area: content-top-header;
  margin-left: 0em;
  min-height: 72px;
  min-width: calc(100% - 172px);
  top: 86px;
  z-index: 15;
  border-radius:.28571429rem;

  @media (max-width: 600px) {
    min-width: 101%;
    margin-top:-76px;
  }
`;

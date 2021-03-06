import styled from 'styled-components';

export default styled.div`
  min-height: 61px;
  min-width: calc(100% - 219px);
  top: 155px;
  z-index: 10;

  @media (max-width: 600px) {
    min-width: 92.5%;
    left: 13px;
  }
`;

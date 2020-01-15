import styled from 'styled-components';

export default styled.div`
  grid-area: content;

  background-color: #f9f8f7;

  display: grid;
  grid-template-rows: minmax(1px, 73px) minmax(1px, 62px) auto;
  grid-template-columns: 1fr;
  grid-template-areas:
    'content-top-header'
    'content-bottom-header'
    'content-body';
`;

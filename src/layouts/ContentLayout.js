import styled from 'styled-components';

export default styled.div`
  grid-area: content;

  background-color: #f9f8f7;

  display: grid;
  grid-template-rows: 73px minmax(0, 20px) minmax(1px, 62px) auto;
  grid-template-columns: 1fr;
  grid-template-areas:
    'content-top-header'
    'content-spacer'
    'content-bottom-header'
    'content-body';
`;

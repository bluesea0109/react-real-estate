import styled from 'styled-components';

export default styled.div`
  height: 100vh;

  display: grid;
  grid-template-rows: [header] 60px [body] auto;
  grid-template-columns: [sidebar] 175px [content] 1fr;
  grid-template-areas:
    'header header'
    'sidebar content-top-header'
    'sidebar content-bottom-header'
    'sidebar content';

  @media (max-width: 768px) {
    grid-template-rows: [header] 60px [sidebar] 60px [body] auto;
    grid-template-columns: [content] 1fr;
    grid-template-areas:
      'header'
      'sidebar'
      'content-top-header'
      'content-bottom-header'
      'content';
  }
`;

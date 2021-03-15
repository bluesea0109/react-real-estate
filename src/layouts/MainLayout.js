import styled from 'styled-components';

export default styled.div`
  height: 100vh;

  display: grid;
  grid-template-rows: ${props => (props.showTopbar ? '[header] 60px' : '[header] 0px')} [body] 1fr;
  grid-template-columns: ${props => (props.showSidebar ? '[sidebar] 58px' : null)} [content] 1fr;
  grid-template-areas:
    'header header'
    ${props => (props.showSidebar ? "'sidebar content'" : "'content content'")};

  @media (max-width: 600px) {
    grid-template-rows: ${props => (props.showTopbar ? '[header] 60px' : '[header] 0px')} ${props =>
        props.showSidebar ? '[sidebar] 60px' : null} [body] 1fr;
    grid-template-columns: [content] 1fr;
    grid-template-areas:
      'header'
      ${props => (props.showSidebar ? "'sidebar'" : null)}
      'content';
  }
`;

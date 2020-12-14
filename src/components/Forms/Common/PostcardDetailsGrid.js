import styled from 'styled-components';

const PostcardDetailsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  grid-column-gap: 1em;
  grid-row-gap: 4px;
  .text-area {
    grid-row: span 2;
    grid-column: span 2;
  }
  @media (max-width: 600px) {
    display: initial;
  }
`;

export default PostcardDetailsGrid;

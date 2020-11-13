import styled from 'styled-components';

const SliderButtons = styled.div`
  position: relative;
  & .back-button,
  & .next-button {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
  }
  & .back-button {
    left: -0.5em;
  }
  & .next-button {
    right: -0.5em;
  }
`;

export default SliderButtons;

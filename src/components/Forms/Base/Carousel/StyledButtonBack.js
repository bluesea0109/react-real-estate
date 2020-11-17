import React from 'react';
import { Icon } from 'semantic-ui-react';
import styled from 'styled-components';
import * as brandColors from '../../../utils/brandColors';

const ContainerDiv = styled.div`
  z-index: 2;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 2.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  transform: translateX(-2.5rem);
  &:hover {
    background-color: ${brandColors.lightGreyHover};
  }
`;

const StyledIcon = styled(Icon)`
  color: grey;
  margin: 0 !important;
`;

export default function StyledButtonBack(props) {
  return (
    <ContainerDiv onClick={props.onClick}>
      <StyledIcon name="angle left" size="big" />
    </ContainerDiv>
  );
}

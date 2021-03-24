import { faLayerGroup } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import styled from 'styled-components';
import { ButtonNoStyle, Icon } from '../../components/Base';
import * as brandColors from '../../components/utils/brandColors';

const EditorNav = styled.nav`
  z-index: 20;
  border-right: 1px solid ${brandColors.grey08};
  box-shadow: ${brandColors.navBoxShadow};
  display: flex;
  flex-direction: column;
  background-color: white;
`;

const StyledNavButton = styled(ButtonNoStyle)`
  padding: 0;
  width: 55px;
  height: 56px;
  border-bottom: solid 1px ${brandColors.grey08};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${brandColors.grey03};
  & > i {
    margin: 0;
    font-size: 1.25em;
    height: 48px;
  }
  &:hover,
  &.active {
    background-color: ${brandColors.primaryLight};
    color: ${brandColors.primary};
  }
  &.active::before {
    content: '';
    display: block;
    position: absolute;
    height: 56px;
    width: 5px;
    left: 0;
    background-color: ${brandColors.primary};
  }
`;

export const NavButton = ({ className, iconName, onClick }) => {
  return (
    <StyledNavButton className={className} onClick={onClick}>
      {iconName === 'layers' ? (
        <FontAwesomeIcon icon={faLayerGroup} size="lg" />
      ) : (
        <Icon name={iconName} />
      )}
    </StyledNavButton>
  );
};

export default EditorNav;

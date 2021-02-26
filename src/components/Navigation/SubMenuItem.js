import React from 'react';
import styled from 'styled-components';
import * as brandColors from '../utils/brandColors';

export const SubMenuContainer = styled.div`
  border-bottom: 1px solid #eaedf0;
  display: flex;
  flex-direction: column;
`;

const StyledSubMenuItem = styled.a`
  &&&&&& {
    line-height: 2;
    font-size: 14px;
    height: 40px;
    padding: 0.5rem;
    color: ${brandColors.grey03};
    &.active {
      color: ${brandColors.primary};
      font-weight: 600;
    }
    :hover {
      color: ${brandColors.primary} !important;
    }
  }
`;

export const SubMenuItem = ({ active, ...props }) => (
  <StyledSubMenuItem {...props} className={active ? 'active' : undefined} />
);

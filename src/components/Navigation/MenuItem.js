import React from 'react';
import styled from 'styled-components';
import * as brandColors from '../utils/brandColors';

const StyledMenuItem = styled.a`
  &&&&&& {
    margin: 0;
    align-self: flex-start;
    display: flex;
    align-items: center;
    & span {
      flex: 1;
    }
    & .icon {
      align-self: flex-end;
      height: 100%;
    }
    width: 100%;
    line-height: 2.6;
    font-size: 16px;
    height: 56px;
    padding: 0.5rem;
    border-bottom: 1px solid #eaedf0;
    color: ${brandColors.grey03};
    :hover {
      color: ${brandColors.primary} !important;
    }
    &.active {
      color: ${brandColors.primary};
      border-left: 5px solid ${brandColors.primary};
      border-bottom: none !important;
      font-weight: 600;
      background-color: ${brandColors.primaryLight} !important;
      .iconWithStyle {
        margin-left: 0.4rem;
      }
      .imageIconWithStyle {
        margin-left: 0.6rem;
      }
      .facebookIconWithStyle {
        margin-left: 0.6em;
      }
      .cogIconStyle {
        margin-left: 8px;
      }
      svg {
        path {
          fill: ${brandColors.primary};
        }
      }
    }
    & svg {
      font-size: 17px;
    }
  }
`;

export const MenuItem = ({ active, ...props }) => (
  <StyledMenuItem {...props} className={active ? 'active' : undefined} />
);

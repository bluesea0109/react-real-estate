import { Button } from 'semantic-ui-react';
import styled from 'styled-components';
import * as brandColors from '../utils/brandColors';

export default styled(Button)`
  &&& {
    min-width: 100px;
    margin: 0.25em;
    &&&.button {
      color: ${brandColors.grey05};
      background-color: #eaeaea;
      &:hover {
        background-color: #e0e0e0;
      }
      &.primary {
        background-color: ${brandColors.primary};
        color: white;
        &:hover,
        &:active,
        &:focus {
          background-color: ${brandColors.primaryHover};
          box-shadow: 0 0 0 2px ${brandColors.primaryHover} inset !important;
          color: ${brandColors.primary};
        }
        &.inverted {
          background-color: transparent;
          box-shadow: 0 0 0 2px ${brandColors.primary} inset !important;
          color: ${brandColors.primary};
          &:hover,
          &:active,
          &:focus {
            background-color: ${brandColors.primary};
            color: white;
          }
        }
      }
      &.secondary {
        background-color: ${brandColors.secondary};
        color: white;
        &:hover,
        &:active,
        &:focus {
          background-color: transparent;
          box-shadow: 0 0 0 2px ${brandColors.secondary} inset !important;
          color: ${brandColors.secondary};
        }
        &.inverted {
          background-color: transparent;
          box-shadow: 0 0 0 2px ${brandColors.secondary} inset !important;
          color: ${brandColors.secondary};
          &:hover,
          &:active,
          &:focus {
            background-color: ${brandColors.secondary};
            color: white;
          }
        }
      }
    }
  }
`;

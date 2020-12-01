import { Button } from 'semantic-ui-react';
import styled from 'styled-components';
import * as brandColors from '../utils/brandColors';

export default styled(Button)`
  &&& {
    min-width: 100px;
    margin: 0.25em;
    &&&.button {
      &.primary {
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

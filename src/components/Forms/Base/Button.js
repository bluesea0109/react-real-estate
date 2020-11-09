import React from 'react';
import { connect } from 'formik';
import hoistNonReactStatics from 'hoist-non-react-statics';
import { Button as SemanticButton } from 'semantic-ui-react';
import styled from 'styled-components';
import * as brandColors from '../../utils/brandColors';

const Button = hoistNonReactStatics(
  props => <SemanticButton {...props} type="button" />,
  SemanticButton
);

Button.Submit = props => <SemanticButton primary {...props} type="submit" />;

Button.Reset = connect(({ formik: { handleReset }, ...props }) => (
  <SemanticButton basic {...props} type="button" onClick={handleReset} />
));

const StyledButton = styled(Button)`
  &&&.button {
    &.primary {
      &:hover,
      &:active,
      &:focus {
        background-color: transparent;
        box-shadow: 0 0 0 2px ${brandColors.primary} inset !important;
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
    &.icon {
      &:hover {
        background-color: #cacbcd;
      }
    }
  }
`;

export default StyledButton;

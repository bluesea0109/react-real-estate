import React from 'react';
import styled from 'styled-components';

const HiddenCheckbox = styled.input.attrs({ type: 'checkbox' })`
  // Hide checkbox visually but remain accessible to screen readers.
  // Source: https://polished.js.org/docs/#hidevisually
  border: 0;
  clip: rect(0 0 0 0);
  clip-path: inset(50%);
  height: 1px;
  margin: -1px;
  overflow: hidden;
  padding: 0;
  position: absolute;
  white-space: nowrap;
  width: 1px;
`;

const CheckboxContainer = styled.div`
  display: inline-block;
  vertical-align: middle;
`;

const Icon = styled.svg`
  fill: none;
  stroke: white;
  stroke-width: 2px;
`;

const StyledCheckbox = styled.div`
  display: inline-block;
  width: 16px;
  height: 16px;
  background: ${props => (props.checked ? 'teal' : 'white')};
  border-radius: 3px;
  transition: all 150ms;
  border: 1px solid black;
`;

const Checkbox = ({ className, checked, onChange, ...props }) => {
  // console.log('checked', checked);
  // console.log('onChange', onChange);

  return (
    <CheckboxContainer className={className}>
      <HiddenCheckbox checked={checked} onChange={onChange} {...props} />
      <StyledCheckbox checked={checked} onChange={onChange}>
        <Icon viewBox="0 0 24 24">
          <polyline points="20 6 9 17 4 12" />
        </Icon>
      </StyledCheckbox>
    </CheckboxContainer>
  );
};

export default Checkbox;

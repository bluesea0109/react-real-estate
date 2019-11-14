import React from 'react';
import { Button } from './Base';
import CSSGrid from './CSSGrid';

const CustomGridExample = () => (
  <CSSGrid columns="50% 50%" gap="10px">
    Basic Button:
    <Button basic>Some text</Button>
  </CSSGrid>
);

export default CustomGridExample;

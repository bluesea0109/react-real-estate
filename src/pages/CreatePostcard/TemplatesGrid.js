import React from 'react';
import GridItem from './GridItem';
import GridLayout from './GridLayout';
import styled from 'styled-components';

const TemplateImg = styled.img`
  width: 100%;
  border: 1px solid #d3d3d3;
`;

export default function TemplatesGrid({ templates }) {
  return (
    <GridLayout>
      {templates.map(template => (
        <GridItem key={template.templateTheme}>
          <TemplateImg src={template.thumbnail} alt="template thumbnail" />
        </GridItem>
      ))}
    </GridLayout>
  );
}

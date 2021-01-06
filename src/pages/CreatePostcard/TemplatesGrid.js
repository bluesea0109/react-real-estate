import React from 'react';
import GridItem from './GridItem';
import GridLayout from './GridLayout';

export default function TemplatesGrid({ templates }) {
  return (
    <GridLayout>
      {templates.map(template => (
        <GridItem key={template.templateTheme}></GridItem>
      ))}
    </GridLayout>
  );
}

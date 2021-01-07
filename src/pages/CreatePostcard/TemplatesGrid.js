import React from 'react';
import { GridItem, GridItemContainer } from './GridItem';
import GridLayout from './GridLayout';
import styled from 'styled-components';
import { Icon } from '../../components/Base';

const TemplateImg = styled.img`
  width: 240px;
  border: 1px solid #d3d3d3;
`;

const ImgOverlay = styled.div`
  position: absolute;
  width: calc(100% - 16px);
  height: calc(100% - 12px);
  top: 6px;
  left: 8px;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  & button {
    width: 100px;
    height: 36px;
    background: transparent;
    padding: 0 1rem;
    border: none;
    font: inherit;
    font-size: 14px;
    font-weight: 600;
    color: white;
    cursor: pointer;
    &:focus {
      outline: none;
    }
    &#select-template {
      margin: 2rem 0 1rem 0;
      border: 2px solid white;
      border-radius: 32px;
    }
  }
  &:hover {
    opacity: 1;
  }
`;

export default function TemplatesGrid({
  templates,
  selectedTemplate,
  setCurrentItem,
  setSelectedTemplate,
  setShowImageModal,
}) {
  return (
    <GridLayout>
      {templates.map((template, index) => (
        <GridItemContainer>
          <GridItem
            key={template.templateTheme}
            selected={selectedTemplate === template.templateTheme}
          >
            <ImgOverlay>
              <button
                id="select-template"
                onClick={() => setSelectedTemplate(template.templateTheme)}
              >
                SELECT
              </button>
              <button
                onClick={() => {
                  setCurrentItem(index);
                  setShowImageModal(true);
                }}
                id="view-template"
              >
                <Icon name="eye" />
                VIEW
              </button>
            </ImgOverlay>
            <TemplateImg src={template.thumbnail} alt="template thumbnail" />
          </GridItem>
          <div className="label-text">{template.templateTheme}</div>
        </GridItemContainer>
      ))}
    </GridLayout>
  );
}

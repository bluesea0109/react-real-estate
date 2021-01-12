import React from 'react';
import { GridItem, GridItemContainer } from './GridItem';
import GridLayout from './GridLayout';
import styled from 'styled-components';
import { ButtonNoStyle, ButtonOutline, Icon } from '../../components/Base';

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
  & #select-template {
    margin: 2rem 0 1rem 0;
  }
  &:hover {
    opacity: 1;
  }
`;

export default function TemplatesGrid({
  templates,
  selectedTemplate,
  setCurrentItem,
  setPreviewImage,
  setSelectedTemplate,
  setShowImageModal,
}) {
  return (
    <GridLayout>
      {templates.map((template, index) => (
        <GridItemContainer key={template?.templateTheme}>
          <GridItem selected={selectedTemplate?.templateTheme === template?.templateTheme}>
            <ImgOverlay>
              <ButtonOutline id="select-template" onClick={() => setSelectedTemplate(template)}>
                SELECT
              </ButtonOutline>
              <ButtonNoStyle
                onClick={() => {
                  setCurrentItem(index);
                  setPreviewImage(template.thumbnail);
                  setShowImageModal(true);
                }}
                id="view-template"
              >
                <Icon name="eye" />
                VIEW
              </ButtonNoStyle>
            </ImgOverlay>
            <TemplateImg src={template.thumbnail} alt="template thumbnail" />
          </GridItem>
          <div className="label-text">{template.templateTheme}</div>
        </GridItemContainer>
      ))}
    </GridLayout>
  );
}

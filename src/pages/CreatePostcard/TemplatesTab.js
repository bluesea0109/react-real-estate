import React from 'react';
import { startCase } from 'lodash';
import { ItemContent, postcardSizes, PostcardSizes, StyledHeading } from '.';
import { Dropdown, Loader } from '../../components/Base';
import TemplatesGrid from './TemplatesGrid';

export default function TemplatesTab({
  availableFilters,
  currentFilter,
  filteredTemplates,
  templatesLoading,
  selectedSize,
  selectedTemplate,
  setCurrentFilter,
  setCurrentItem,
  setPreviewImage,
  setSelectedSize,
  setSelectedTemplate,
  setShowImageModal,
}) {
  return (
    <>
      <StyledHeading>
        <p>Select a size</p>
      </StyledHeading>
      <PostcardSizes
        sizes={postcardSizes}
        selectedSize={selectedSize}
        setSelectedSize={setSelectedSize}
      />
      <StyledHeading>
        <Dropdown text={startCase(currentFilter)}>
          <Dropdown.Menu>
            {availableFilters.map(filter => (
              <Dropdown.Item key={filter} onClick={() => setCurrentFilter(filter)}>
                <ItemContent>
                  <span>{startCase(filter)}</span>
                </ItemContent>
              </Dropdown.Item>
            ))}
            <Dropdown.Header />
          </Dropdown.Menu>
        </Dropdown>
        <Loader active={templatesLoading} inline size="small" />
      </StyledHeading>
      <TemplatesGrid
        templates={filteredTemplates}
        selectedSize={selectedSize}
        selectedTemplate={selectedTemplate}
        setCurrentItem={setCurrentItem}
        setPreviewImage={setPreviewImage}
        setSelectedTemplate={setSelectedTemplate}
        setShowImageModal={setShowImageModal}
      />
    </>
  );
}

import React from 'react';
import styled from 'styled-components';
import EditorTab from './EditorTab';
import TemplatesTab from './TemplatesTab';
import * as brandColors from '../../components/utils/brandColors';

function SidebarContent({
  activeTab,
  className,
  colorPickerVal,
  customCTA,
  customizeCTA,
  handleSave,
  invalidCTA,
  newCTA,
  setColorPickerVal,
  setCustomizeCTA,
  setInvalidCTA,
  setNewCTA,
  mailoutDetails,
}) {
  return (
    <div className={className}>
      <h3 className="title">{activeTab}</h3>
      {activeTab === 'Editor' && (
        <EditorTab
          colorPickerVal={colorPickerVal}
          customCTA={customCTA}
          customizeCTA={customizeCTA}
          handleSave={handleSave}
          invalidCTA={invalidCTA}
          newCTA={newCTA}
          setColorPickerVal={setColorPickerVal}
          setCustomizeCTA={setCustomizeCTA}
          setInvalidCTA={setInvalidCTA}
          setNewCTA={setNewCTA}
        />
      )}
      {activeTab === 'Select Templates' && (
        <TemplatesTab handleSave={handleSave} mailoutDetails={mailoutDetails} />
      )}
    </div>
  );
}

const EditorSidebar = styled(SidebarContent)`
  padding: 0 1rem;
  z-index: 10;
  box-shadow: 2px 0 6px -2px rgba(128, 128, 128, 0.5);
  color: ${brandColors.grey03};
  font-weight: 500;
  overflow: auto;
  ::-webkit-scrollbar {
    width: 0;
  }
  & .title {
    margin: 1rem 0;
    padding: 0.5rem;
  }
`;

export default EditorSidebar;

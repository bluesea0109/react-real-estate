import React, { useState } from 'react';
import styled from 'styled-components';
import EditorTab from './EditorTab';
import TemplatesTab from './TemplatesTab';
import * as brandColors from '../../components/utils/brandColors';
import { Icon } from '../../components/Base';

const SidebarContent = styled.div`
  width: ${props => props.width}px;
  transition: 300ms;
  padding: 0 ${props => props.width && '1rem'};
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
    display: flex;
    justify-content: space-between;
    align-items: center;
    & > i {
      color: ${brandColors.primary};
      font-size: 1.25rem;
      cursor: pointer;
    }
  }
`;

function EditorSidebar({
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
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  return (
    <SidebarContent width={sidebarCollapsed ? 0 : 330}>
      <div className="title">
        <h3>{activeTab}</h3>
        <Icon name="arrow left" onClick={() => setSidebarCollapsed(true)} />
      </div>
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
    </SidebarContent>
  );
}

export default EditorSidebar;

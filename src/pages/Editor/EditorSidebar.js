import React from 'react';
import styled from 'styled-components';
import EditorTab from './EditorTab';
import TemplatesTab from './TemplatesTab';
import * as brandColors from '../../components/utils/brandColors';
import { Icon } from '../../components/Base';
import { useDispatch, useSelector } from 'react-redux';
import { setSidebarOpen } from '../../store/modules/liveEditor/actions';

const SidebarWrapper = styled.div`
  width: ${props => (props.sidebarOpen ? '330px' : '0px')};
  transition: width 0.25s ease;
  overflow: hidden;
  z-index: 10;
  box-shadow: 2px 0 6px -2px rgba(128, 128, 128, 0.5);
  overflow: auto;
  overflow-x: hidden;
  ::-webkit-scrollbar {
    width: 0;
  }
`;

const SidebarContent = styled.div`
  transform: translateX(${props => (props.sidebarOpen ? '0px' : '-330px')});
  transition: transform 0.25s ease;
  color: ${brandColors.grey03};
  padding: 0 1rem;
  font-weight: 500;
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
  colorPickerVal,
  customCTA,
  customizeCTA,
  hideCTA,
  handleSave,
  invalidCTA,
  newCTA,
  setColorPickerVal,
  setCustomizeCTA,
  setInvalidCTA,
  setNewCTA,
  setHideCTA,
  mailoutDetails,
  showCTA,
}) {
  const dispatch = useDispatch();
  const sidebarOpen = useSelector(state => state.liveEditor?.sidebarOpen);
  return (
    <SidebarWrapper sidebarOpen={sidebarOpen}>
      <SidebarContent sidebarOpen={sidebarOpen}>
        <div className="title">
          <h3>{activeTab}</h3>
          <Icon name="arrow left" onClick={() => dispatch(setSidebarOpen(false))} />
        </div>
        {activeTab === 'Editor' && (
          <EditorTab
            colorPickerVal={colorPickerVal}
            customCTA={customCTA}
            customizeCTA={customizeCTA}
            hideCTA={hideCTA}
            handleSave={handleSave}
            invalidCTA={invalidCTA}
            newCTA={newCTA}
            setColorPickerVal={setColorPickerVal}
            setCustomizeCTA={setCustomizeCTA}
            setHideCTA={setHideCTA}
            setInvalidCTA={setInvalidCTA}
            setNewCTA={setNewCTA}
            showCTA={showCTA}
          />
        )}
        {activeTab === 'Pages' && (
          <TemplatesTab handleSave={handleSave} mailoutDetails={mailoutDetails} />
        )}
      </SidebarContent>
    </SidebarWrapper>
  );
}

export default EditorSidebar;

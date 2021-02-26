import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as brandColors from '../utils/brandColors';
import { Grid, Menu, Segment, Sidebar } from 'semantic-ui-react';
import styled from 'styled-components';
import { useWindowSize } from '../Hooks/useWindowSize';

const MobileMenu = styled.div`
  .pushable {
    overflow-x: visible;
    .sidebar {
      overflow-y: visible !important;
      & .accordionDrop,
      & .accordionDropCustom {
        width: 100%;
        overflow: visible;
        display: flex;
        flex-direction: column;
        height: auto;
        text-align: left;
        margin-left: 1rem;
        & > a {
          color: ${brandColors.grey03};
          margin: 8px;
          &.active {
            color: ${brandColors.primary};
          }
        }
      }
    }
    a {
      text-align: left;
    }
  }
`;

const ToggleContainer = styled.div`
  width: 56px;
  box-shadow: 0 2px 4px 0 rgba(34, 36, 38, 0.12), 0 2px 10px 0 rgba(34, 36, 38, 0.15);
  transition: 0.4s;
  background-color: white;
  height: 100vh;
  overflow: auto;
  position: hidden;
  z-index: 99999999999999;
  margin-top: 2px;
  .svgHover {
    path {
      fill: ${brandColors.primary};
    }
  }
  & .accordionDrop {
    padding: 4px 4px 4px 16px;
    border-bottom: 1px solid #eaedf0;
    a {
      padding: 6px;
      color: #3b3b3b !important;
      border-bottom: none !important;
      &:hover {
        color: ${brandColors.primary} !important;
      }
    }
    .active {
      color: ${brandColors.primary} !important;
      font-weight: 600 !important;
    }
  }
  &.expand {
    width: 225px;
  }
  & .noDropdown {
    transition: 0.2s;
    height: 0px;
    overflow: hidden;
  }
  & .accordionDrop,
  & .accordionDropCustom {
    /* height: 60px; */
    width: 100%;
    overflow: visible;
    display: flex;
    height: auto;
    flex-direction: column;
  }
`;

const SidebarSlider = ({ children, moblileVisible, setMobileVisible, toggle, setToggle }) => {
  const [isMobile, setIsMobile] = useState(window.matchMedia('(max-width: 599px)').matches);
  const size = useWindowSize();

  useEffect(() => {
    setIsMobile(size.width < 600);
  }, [size]);

  return (
    <>
      {isMobile ? (
        <MobileMenu>
          <Grid.Column style={{ paddingTop: '1em', paddingLeft: '1em' }}>
            <FontAwesomeIcon
              icon="bars"
              style={{ fontSize: '1.9em', color: '#808080' }}
              onClick={() => {
                if (!moblileVisible) {
                  setMobileVisible(true);
                }
              }}
            ></FontAwesomeIcon>
          </Grid.Column>
          <Sidebar.Pushable as={Segment}>
            <Sidebar
              as={Menu}
              animation="overlay"
              icon="labeled"
              onHide={() => setMobileVisible(false)}
              vertical
              visible={moblileVisible}
              width="thin"
            >
              {children}
            </Sidebar>
          </Sidebar.Pushable>
        </MobileMenu>
      ) : (
        <>
          <ToggleContainer
            className={`toggle-container ${toggle}`}
            onMouseOver={() => {
              if (!toggle) {
                setToggle('expand');
              }
            }}
            onMouseLeave={() => {
              if (toggle.length) {
                setToggle(false);
              }
            }}
          >
            {children}
          </ToggleContainer>
        </>
      )}
    </>
  );
};

export default SidebarSlider;

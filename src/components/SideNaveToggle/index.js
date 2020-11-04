import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './styles.scss';

import { Grid, Menu, Segment, Sidebar } from 'semantic-ui-react';
import styled from 'styled-components';

function useWindowSize() {
  const [windowSize, setWindowSize] = useState({
    width: undefined,
    height: undefined,
  });
  useEffect(() => {
    // Handler to call on window resize
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }

    window.addEventListener('resize', handleResize);

    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowSize;
}

const ToggleContainer = styled.div`
  width: 56px;
  box-shadow: 0 2px 4px 0 rgba(34, 36, 38, 0.12), 0 2px 10px 0 rgba(34, 36, 38, 0.15);
  transition: 0.4s;
  background-color: white;
  height: 100vh;
  overflow: hidden;
  position: absolute;
  z-index: 99999999999999;
  margin-top: 2px;
  .svgHover {
    path {
      fill: #59c4c4;
    }
  }

  &&& .teal.active.item {
    color: #59c4c4;
    border-left: 5px solid #59c4c4;
    border-bottom: 1px solid #eaedf0;
    font-weight: 600;
    background-color: #eef9f9;

    .iconWithStyle {
      margin: 0em 1em 0em 0.35em;
    }
    .teamIconStyle {
      margin: 0em 1em 0em 0.32em;
    }
    .cogIconStyle {
      margin-left: 7px;
    }

    svg {
      path {
        fill: #59c4c4;
      }
    }
  }
  a {
    font-family: 'Open Sans', sans-serif;
    border-bottom: 1px solid #eaedf0 !important;
    svg {
      font-size: 17px;
    }
  }
  .noDropdown {
    .menu {
      padding-top: 11px;
      border-bottom: 1px solid #eaedf0;
    }
    a {
      color: #3b3b3b !important;
      border-bottom: none !important;
    }

    .teal.active.item {
      border-left: none !important;
      border-bottom: 1px solid white !important;
      font-weight: 600 !important;
      background-color: #ffffff !important;
      color: #3b3b3b !important;
    }
  }
  .ui.vertical.steps {
    width: 240px;
    padding: 0px;
    margin-left: -1px;
    margin-top: -1px;
    .step:after {
      display: none;
    }
    .step {
      height: 56px;
      padding: 0px;
      border-bottom: 1px solid #eaedf0;
      svg {
        margin-left: 8px;
      }
      .title {
        font-weight: 400;
        font-family: 'Open Sans', sans-serif;
        color: rgba(0, 0, 0, 0.6);
      }
    }

    .active {
      border-radius: 0px;
      padding: 0px;
      color: #59c4c4;
      border-left: 5px solid #59c4c4 !important;
      border-bottom: 1px solid #eaedf0 !important;
      font-weight: 600;
      background-color: #eef9f9 !important;
      svg {
        margin-left: 3px;
      }
      #step1Path,
      #step2Path,
      #step3Path,
      #step4Path {
        fill: #59c4c4;
      }
      .title {
        font-weight: 600;
        color: #59c4c4;
      }
      .content {
        margin-left: -5px;
      }
    }
  }
  &.expand {
    width: 225px;
  }
  .noDropdown {
    transition: 0.2s;
    height: 0px;
    overflow: hidden;
  }
`;

const SidebarSlider = ({ children, moblileVisible, setMobileVisible, toggle, setToggle }) => {
  const [isMobile, setIsMobile] = useState(window.matchMedia('(max-width: 768px)').matches);
  const size = useWindowSize();

  useEffect(() => {
    setIsMobile(window.matchMedia('(max-width: 599px)').matches);
  }, [size]);

  return (
    <>
      {isMobile ? (
        <>
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
            <Sidebar as={Menu} animation="overlay" icon="labeled" onHide={() => setMobileVisible(false)} vertical visible={moblileVisible} width="thin">
              {children}
            </Sidebar>
          </Sidebar.Pushable>
        </>
      ) : (
        <>
          <ToggleContainer
            className={`toggle-container ${toggle}`}
            onMouseOver={() => {
              if (!toggle.length) {
                setToggle('expand');
              }
            }}
            onMouseLeave={() => {
              if (toggle.length) {
                setToggle('');
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

const StyledSidebar = styled(SidebarSlider)``;

export default StyledSidebar;

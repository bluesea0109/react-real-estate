import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import 'semantic-ui-css/semantic.min.css';
import './styles.scss';

import { Grid, Menu, Segment, Sidebar } from 'semantic-ui-react';

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

const SidebarSlider = ({ children, moblileVisible, setMobileVisible }) => {
  const [toggle, setToggle] = useState('');
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
          <div
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
          </div>
        </>
      )}
    </>
  );
};

export default SidebarSlider;

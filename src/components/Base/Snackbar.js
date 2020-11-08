import React, { useEffect, useState } from 'react';
import { Message, Icon } from 'semantic-ui-react';
import styled from 'styled-components';

const SnackbarMessage = styled(Message)`
  min-width: 500px;
  border-left: solid 3px;
  box-shadow: none;
  -webkit-box-shadow: none;
  border-radius: 0 !important;
  font-size: 1em;
  z-index: 110;
  position: fixed !important;
  top: 1.5%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: block !important;
`;

const Snackbar = ({ error = false, info = false, success = false, children }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    let isInitialized = true;

    (async function closeIt() {
      await new Promise(resolve => setTimeout(resolve, 10000));
      if (isInitialized) {
        setVisible(false);
      }
    })();

    return () => (isInitialized = false);
  }, [setVisible]);

  return visible ? (
    <SnackbarMessage info={info} error={error} success={success}>
      <Icon
        name={success ? 'check circle' : error ? 'times circle' : info ? 'info circle' : null}
      />
      <b>{success ? 'Hurray! ' : error ? 'Oops! ' : info ? 'Heads Up! ' : null}</b>
      <span>{children}</span>
      <Icon
        name="times"
        style={{ float: 'right', cursor: 'pointer' }}
        onClick={() => setVisible(false)}
      />
    </SnackbarMessage>
  ) : null;
};

export default Snackbar;

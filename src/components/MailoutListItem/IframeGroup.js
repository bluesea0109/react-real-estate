import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Segment } from 'semantic-ui-react';
import React, { useCallback, useState } from 'react';

import { ItemBodyIframeLayout } from '../../layouts';
import ApiService from '../../services/api/index';
import { isMobile } from '../utils';

const linkStyle = { position: 'absolute', top: 0, left: 0, display: 'inline-block', width: '300px', height: '204px', zIndex: 5 };

const IframeGroup = ({ index, item, linkTo = null }) => {
  const peerId = useSelector(store => store.peer.peerId);

  const [frontLoaded, setFrontLoaded] = useState(false);
  const [backLoaded, setBackLoaded] = useState(false);

  const frontURL = peerId
    ? ApiService.directory.peer.mailout.render.front({ userId: item?.userId, peerId, mailoutId: item?._id }).path
    : ApiService.directory.user.mailout.render.front({ userId: item?.userId, mailoutId: item?._id }).path;

  const backURL = peerId
    ? ApiService.directory.peer.mailout.render.back({ userId: item?.userId, peerId, mailoutId: item?._id }).path
    : ApiService.directory.user.mailout.render.back({ userId: item?.userId, mailoutId: item?._id }).path;

  const handleOnload = useCallback(
    event => {
      const {
        name,
        document: { body },
      } = event.target.contentWindow;

      body.style.overflow = 'hidden';
      body.style['pointer-events'] = 'none';
      body.style.transform = 'translate(-25%,-25%) scale(0.5)';

      if (name === 'front') {
        setFrontLoaded(true);
      }

      if (name === 'back') {
        setBackLoaded(true);
      }
    },
    [setFrontLoaded, setBackLoaded]
  );

  if (linkTo) {
    return (
      <ItemBodyIframeLayout horizontal={!isMobile()} style={{ border: 'none', boxShadow: 'none' }} id={`mailout-iframe-set-${index}`}>
        <Segment textAlign="center" loading={!frontLoaded} style={{ border: 'none' }}>
          <div style={{ width: '300px', height: '204px' }} className="bm-transform-effect image-frame-border">
            <iframe
              id="bm-iframe-front"
              title={frontURL + '?dashboard=true'}
              name="front"
              src={null}
              width="300"
              height="204"
              frameBorder="none"
              sandbox="allow-same-origin allow-scripts"
              onLoad={handleOnload}
            />
            <Link to={linkTo} style={linkStyle} />
          </div>
        </Segment>
        <Segment textAlign="center" loading={!backLoaded} style={{ border: 'none' }}>
          <div style={{ width: '300px', height: '204px' }} className="bm-transform-effect image-frame-border">
            <iframe
              id="bm-iframe-back"
              title={backURL + '?dashboard=true'}
              name="back"
              src={null}
              width="300"
              height="204"
              frameBorder="none"
              sandbox="allow-same-origin allow-scripts"
              onLoad={handleOnload}
            />
            <Link to={linkTo} style={linkStyle} />
          </div>
        </Segment>
      </ItemBodyIframeLayout>
    );
  } else {
    return (
      <ItemBodyIframeLayout horizontal={!isMobile()} style={{ border: 'none', boxShadow: 'none' }} id={`mailout-iframe-set-${index}`}>
        <Segment textAlign="center" loading={!frontLoaded} style={{ border: 'none' }}>
          <iframe
            id="bm-iframe-front"
            title={frontURL}
            name="front"
            src={null}
            width="300"
            height="204"
            frameBorder="0"
            sandbox="allow-same-origin allow-scripts"
            onLoad={handleOnload}
            className="image-frame-border"
          />
        </Segment>
        <Segment textAlign="center" loading={!backLoaded} style={{ border: 'none' }}>
          <iframe
            id="bm-iframe-back"
            title={backURL}
            name="back"
            src={null}
            width="300"
            height="204"
            frameBorder="0"
            sandbox="allow-same-origin allow-scripts"
            onLoad={handleOnload}
            className="image-frame-border"
          />
        </Segment>
      </ItemBodyIframeLayout>
    );
  }
};

IframeGroup.propTypes = {
  item: PropTypes.object.isRequired,
  linkTo: PropTypes.string,
};

export default IframeGroup;

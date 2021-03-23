import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Segment } from 'semantic-ui-react';
import React, { useCallback, useState } from 'react';

import { iframeTransformMobile, iframeLinkStyle } from '../utils/helpers';
import { ItemBodyIframeLayout } from '../../layouts';
import ApiService from '../../services/api/index';
import { Image } from '../Base';

import './IframeGroup.css';

const IframeGroup = ({ index, item, linkTo = null }) => {
  const peerId = useSelector(store => store.peer.peerId);

  const [frontLoaded, setFrontLoaded] = useState(false);
  const [backLoaded, setBackLoaded] = useState(false);

  const frontURL = peerId
    ? ApiService.directory.peer.mailout.render.front({
        userId: item?.userId,
        peerId,
        mailoutId: item?._id,
      }).path
    : ApiService.directory.user.mailout.render.front({ userId: item?.userId, mailoutId: item?._id })
        .path;

  const backURL = peerId
    ? ApiService.directory.peer.mailout.render.back({
        userId: item?.userId,
        peerId,
        mailoutId: item?._id,
      }).path
    : ApiService.directory.user.mailout.render.back({ userId: item?.userId, mailoutId: item?._id })
        .path;

  const handleOnload = useCallback(
    event => {
      const {
        name,
        document: { body },
      } = event.target.contentWindow;

      body.style.overflow = 'hidden';
      body.style['pointer-events'] = 'none';
      body.style.transform = iframeTransformMobile;

      if (name === 'front') {
        setFrontLoaded(true);
      }

      if (name === 'back') {
        setBackLoaded(true);
      }
    },
    [setFrontLoaded, setBackLoaded]
  );

  const imgStyles = {
    maxWidth: '300px',
    minWidth: '290px',
    height: '204px',
  };

  const IFrameBodyStyles = {
    border: 'none',
    boxShadow: 'none',
    flexWrap: 'wrap',
  };

  const IFrameStyles = {
    border: 'none',
    display: 'flex',
    justifyContent: 'center',
  };

  if (linkTo) {
    return (
      <ItemBodyIframeLayout horizontal style={IFrameBodyStyles} id={`mailout-iframe-set-${index}`}>
        {item.frontResourceUrl && (
          <Segment textAlign="center" style={{ border: 'none' }}>
            <Link to={linkTo}>
              <Image
                src={item.frontResourceUrl}
                style={imgStyles}
                className="bm-transform-effect image-frame-border"
              />
            </Link>
          </Segment>
        )}
        {!item.frontResourceUrl && (
          <Segment textAlign="center" loading={!item?._id || !frontLoaded} style={IFrameStyles}>
            <div
              style={{ width: '300px', height: '204px', overflow: 'hidden' }}
              className="bm-transform-effect image-frame-border"
            >
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
                style={{ visibility: !item?._id || !frontLoaded ? 'hidden' : 'visible' }}
              />
              <Link to={linkTo} style={iframeLinkStyle} />
            </div>
          </Segment>
        )}

        {item.backResourceUrl && (
          <Segment
            textAlign="center"
            style={{ border: 'none', display: 'flex', justifyContent: 'center' }}
            className="bm-transform-effect image-frame-border"
          >
            <Link to={linkTo}>
              <div
                style={{
                  position: 'relative',
                  ...imgStyles,
                }}
              >
                <Image src={item.backResourceUrl} />
                <div id="ink-free-area-small">
                  <div id="postage-small">
                    POSTAGE
                    <br />
                    INDICIA
                  </div>
                  <div id="cust-address-small">
                    Recipient name and full address will be printed in this space.
                  </div>
                  <span id="ink-free-text-small">This area is reserved for postage details</span>
                </div>
              </div>
            </Link>
          </Segment>
        )}

        {!item.backResourceUrl && (
          <Segment textAlign="center" loading={!item?._id || !backLoaded} style={IFrameStyles}>
            <div
              style={{ width: '300px', height: '204px', overflow: 'hidden' }}
              className="bm-transform-effect image-frame-border"
            >
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
                style={{ visibility: !item?._id || !backLoaded ? 'hidden' : 'visible' }}
              />
              <Link to={linkTo} style={iframeLinkStyle} />
            </div>
          </Segment>
        )}
      </ItemBodyIframeLayout>
    );
  } else {
    return (
      <ItemBodyIframeLayout horizontal style={IFrameBodyStyles} id={`mailout-iframe-set-${index}`}>
        {item.frontResourceUrl && (
          <Segment textAlign="center" style={{ border: 'none' }}>
            <Image
              src={item.frontResourceUrl}
              style={imgStyles}
              className="bm-transform-effect image-frame-border"
            />
          </Segment>
        )}
        {!item.frontResourceUrl && (
          <Segment textAlign="center" loading={!item?._id || !frontLoaded} style={IFrameStyles}>
            <div
              style={{ width: '300px', height: '204px', overflow: 'hidden' }}
              className="image-frame-border"
            >
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
                style={{ visibility: !item?._id || !frontLoaded ? 'hidden' : 'visible' }}
              />
            </div>
          </Segment>
        )}

        {item.backResourceUrl && (
          <Segment textAlign="center" style={{ border: 'none' }}>
            <Image
              src={item.backResourceUrl}
              style={imgStyles}
              className="bm-transform-effect image-frame-border"
            />
          </Segment>
        )}
        {!item.backResourceUrl && (
          <Segment textAlign="center" loading={!item?._id || !backLoaded} style={IFrameStyles}>
            <div
              style={{ width: '300px', height: '204px', overflow: 'hidden' }}
              className="image-frame-border"
            >
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
                style={{ visibility: !item?._id || !backLoaded ? 'hidden' : 'visible' }}
              />
            </div>
          </Segment>
        )}
      </ItemBodyIframeLayout>
    );
  }
};

IframeGroup.propTypes = {
  item: PropTypes.object.isRequired,
  linkTo: PropTypes.string,
};

export default IframeGroup;

import React, { forwardRef } from 'react';
import { IFrameSegStyle } from '.';
import { Image, Segment } from '../../components/Base';
import { iframeDimensions } from '../../components/utils/utils';
import { getLargerSize } from '../Utils/getLargerSize';
import { StyledFrame } from './StyledComponents';
import './BackIframe.css';

const BackIframe = forwardRef(
  (
    {
      campaignId,
      backLoaded,
      backResourceUrl,
      backURL,
      handleOnload,
      postcardSize,
      reloadPending,
      scale,
      rotate,
    },
    ref
  ) => {
    let scaleValue = scale || 1;
    return (
      <StyledFrame postcardSize={postcardSize} scale={scaleValue} rotate={rotate}>
        <div className="scale-wrapper">
          {backResourceUrl && (
            <>
              <div
                className="bleed"
                style={{
                  position: 'absolute',
                  height: iframeDimensions(postcardSize).height,
                  width: iframeDimensions(postcardSize).width,
                  border: '0.125in solid white',
                  zIndex: 99,
                  opacity: '75%',
                }}
              ></div>
              <div
                className="safe-zone"
                style={{
                  position: 'absolute',
                  border: '2px dashed red',
                  zIndex: 100,
                  top: 'calc((0.325in / 2) - 1px)',
                  left: 'calc((0.325in / 2) - 1px)',
                  width: `calc(${iframeDimensions(postcardSize).width}px - 0.325in)`,
                  height: `calc(${iframeDimensions(postcardSize).height}px - 0.325in)`,
                }}
              ></div>
              <div
                className="cut-text"
                style={{
                  position: 'absolute',
                  color: 'red',
                  zIndex: 100,
                  left: `calc(${iframeDimensions(postcardSize).width / 2 - 100}px)`,
                  top: 0,
                  fontSize: '10px',
                  fontWeight: 'bold',
                  lineHeight: '1em',
                  whiteSpace: 'nowrap',
                }}
              >
                Safe Zone - All text should be inside this area
              </div>
              <div
                style={{
                  position: 'relative',
                  minWidth: `${iframeDimensions(postcardSize).width}px`,
                  maxWidth: `${iframeDimensions(postcardSize).width}px`,
                  height: `${iframeDimensions(postcardSize).height}px`,
                  boxSizing: 'border-box',
                  margin: 0,
                }}
              >
                <Image src={backResourceUrl} className="image-frame-border" />
                <div id="ink-free-area" style={{ width: getLargerSize(postcardSize) && '4in' }}>
                  <div id="postage">
                    POSTAGE
                    <br />
                    INDICIA
                  </div>
                  <div id="cust-address">
                    Recipient name and full address will be printed in this space.
                  </div>
                  <span id="ink-free-text">This area is reserved for postage details</span>
                </div>
              </div>
            </>
          )}
          {!backResourceUrl && (
            <Segment
              compact
              textAlign="center"
              loading={!campaignId || !backLoaded || reloadPending}
              style={IFrameSegStyle}
            >
              <iframe
                id="bm-iframe-back"
                title={`bm-iframe-back-${campaignId}`}
                name="back"
                src={backURL}
                width={`${iframeDimensions(postcardSize).width}`}
                height={`${iframeDimensions(postcardSize).height}`}
                frameBorder="0"
                sandbox="allow-same-origin allow-scripts"
                onLoad={handleOnload}
                className="image-frame-border"
                style={{ visibility: !campaignId || !backLoaded ? 'hidden' : 'visible' }}
                ref={ref}
              />
            </Segment>
          )}
        </div>
      </StyledFrame>
    );
  }
);

export default BackIframe;

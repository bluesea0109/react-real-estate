import React, { forwardRef } from 'react';
import { IFrameSegStyle } from '.';
import { Image, Segment } from '../../components/Base';
import { iframeDimensions } from '../../components/utils/utils';
import { StyledFrame } from './StyledComponents';

const FrontIframe = forwardRef(
  (
    {
      campaignId,
      frontLoaded,
      frontResourceUrl,
      frontURL,
      handleOnload,
      postcardSize,
      reloadPending,
      scale,
    },
    ref
  ) => {
    let scaleValue = scale || 1;
    return (
      <StyledFrame postcardSize={postcardSize} scale={scaleValue}>
        <div className="scale-wrapper">
          {frontResourceUrl && (
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
              <Image
                src={frontResourceUrl}
                className="image-frame-border"
                style={{
                  minWidth: `${iframeDimensions(postcardSize).width}px`,
                  maxWidth: `${iframeDimensions(postcardSize).width}px`,
                  height: `${iframeDimensions(postcardSize).height}px`,
                  boxSizing: 'border-box',
                  margin: 0,
                }}
              />
            </>
          )}
          {!frontResourceUrl && (
            <Segment
              compact
              textAlign="center"
              loading={!campaignId || !frontLoaded || reloadPending}
              style={IFrameSegStyle}
            >
              <iframe
                id="bm-iframe-front"
                title={`bm-iframe-front-`}
                name="front"
                src={frontURL}
                width={`${iframeDimensions(postcardSize).width}`}
                height={`${iframeDimensions(postcardSize).height}`}
                frameBorder="0"
                sandbox="allow-same-origin allow-scripts"
                onLoad={handleOnload}
                className="image-frame-border"
                style={{ visibility: !campaignId || !frontLoaded ? 'hidden' : 'visible' }}
                ref={ref}
              />
            </Segment>
          )}
        </div>
      </StyledFrame>
    );
  }
);

export default FrontIframe;

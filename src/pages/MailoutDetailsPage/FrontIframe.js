import React, { forwardRef } from 'react';
import { IFrameSegStyle } from '.';
import { Image, Segment } from '../../components/Base';
import { iframeDimensions } from '../../components/utils/utils';

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
    },
    ref
  ) => {
    return (
      <div
        style={{
          position: 'relative',
          height: iframeDimensions(postcardSize).height,
          width: iframeDimensions(postcardSize).width,
          boxSizing: 'border-box',
        }}
      >
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
                left: 'calc(50% - 100px)',
                top: 0,
                fontSize: '10px',
                fontWeight: 'bold',
                lineHeight: '1em',
              }}
            >
              Safe Zone - All text should be inside this area
            </div>
            <Image
              src={frontResourceUrl}
              className="image-frame-border"
              style={{
                height: '100%',
                width: '100%',
                boxSizing: 'border-box',
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
              title={`bm-iframe-front-${campaignId}`}
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
    );
  }
);

export default FrontIframe;

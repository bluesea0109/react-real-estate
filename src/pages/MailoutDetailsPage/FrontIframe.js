import React, { forwardRef } from 'react';
import { IFrameSegStyle } from '.';
import { Image, Segment } from '../../components/Base';
import { iframeDimensions } from '../../components/utils/utils';

const FrontIframe = forwardRef(({ details, frontLoaded, frontURL, handleOnload }, ref) => {
  return (
    <div
      style={{
        position: 'relative',
        height: iframeDimensions(details.postcardSize).height,
        width: iframeDimensions(details.postcardSize).width,
        boxSizing: 'border-box',
      }}
    >
      {details.frontResourceUrl && (
        <>
          <div
            className="bleed"
            style={{
              position: 'absolute',
              height: iframeDimensions(details.postcardSize).height,
              width: iframeDimensions(details.postcardSize).width,
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
              width: `calc(${iframeDimensions(details.postcardSize).width}px - 0.325in)`,
              height: `calc(${iframeDimensions(details.postcardSize).height}px - 0.325in)`,
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
            src={details.frontResourceUrl}
            className="image-frame-border"
            style={{
              height: '100%',
              width: '100%',
              boxSizing: 'border-box',
            }}
          />
        </>
      )}
      {!details.frontResourceUrl && (
        <Segment
          compact
          textAlign="center"
          loading={!details?._id || !frontLoaded}
          style={IFrameSegStyle}
        >
          <iframe
            id="bm-iframe-front"
            title={`bm-iframe-front-${details._id}`}
            name="front"
            src={frontURL}
            width={`${iframeDimensions(details.postcardSize).width}`}
            height={`${iframeDimensions(details.postcardSize).height}`}
            frameBorder="0"
            sandbox="allow-same-origin allow-scripts"
            onLoad={handleOnload}
            className="image-frame-border"
            style={{ visibility: !details?._id || !frontLoaded ? 'hidden' : 'visible' }}
            ref={ref}
          />
        </Segment>
      )}
    </div>
  );
});

export default FrontIframe;

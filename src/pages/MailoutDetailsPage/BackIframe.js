import React, { forwardRef } from 'react';
import { IFrameSegStyle } from '.';
import { Segment } from '../../components/Base';
import { iframeDimensions } from '../../components/utils/utils';

const BackIframe = forwardRef(({ backLoaded, backURL, details, handleOnload }, ref) => {
  return (
    <Segment
      compact
      textAlign="center"
      loading={!details?._id || !backLoaded}
      style={IFrameSegStyle}
    >
      <iframe
        id="bm-iframe-back"
        title={`bm-iframe-back-${details._id}`}
        name="back"
        src={backURL}
        width={`${iframeDimensions(details.postcardSize).width}`}
        height={`${iframeDimensions(details.postcardSize).height}`}
        frameBorder="0"
        sandbox="allow-same-origin allow-scripts"
        onLoad={handleOnload}
        className="image-frame-border"
        style={{ visibility: !details?._id || !backLoaded ? 'hidden' : 'visible' }}
        ref={ref}
      />
    </Segment>
  );
});

export default BackIframe;

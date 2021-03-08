import React, { forwardRef } from 'react';
import { IFrameSegStyle } from '.';
import { Segment } from '../../components/Base';
import { iframeDimensions } from '../../components/utils/utils';

const BackIframe = forwardRef(
  ({ campaignId, backLoaded, backURL, handleOnload, postcardSize, reloadPending }, ref) => {
    return (
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
    );
  }
);

export default BackIframe;

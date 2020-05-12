import React, { Fragment, Component } from 'react';
import { GoogleMap } from '@react-google-maps/api';
import { Segment } from '../../Base';

const center = {
  lat: 40.7608,
  lng: -111.891,
};

const containerStyle = {
  position: 'relative',
  width: '100%',
  height: '100%',
};

const onClick = (...args) => {
  // console.log('onClick args: ', args);
};

const onMapLoad = map => {
  // console.log('map: ', map);
};

const DestinationsDisplay = ({ data }) => {
  return (
    <Fragment>
      <Segment attached style={{ height: '50vh', top: '-1px' }}>

          <GoogleMap
            id="destinations-map-display"
            mapContainerStyle={containerStyle}
            zoom={12}
            center={{ lat: data.details && data.details.latitude, lng: data.details && data.details.longitude }}
            onClick={onClick}
            onLoad={onMapLoad}
          >
          {/* {ifLoadedPageBackIn ? <Polygon /> : <DrawingManger />} */}
          </GoogleMap>

      </Segment>
    </Fragment>
  );
};

export default DestinationsDisplay;

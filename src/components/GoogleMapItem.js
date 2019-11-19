import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import { Segment } from 'semantic-ui-react';
import { Map, GoogleApiWrapper, Marker } from 'google-maps-react';

import config from '../config';

const containerStyle = {
  position: 'relative',
  width: '100%',
  height: '100%',
};

const GoogleMapItem = ({ data, loaded, google }) => {
  if (!data || !google || !loaded || !data.destinations) return;

  const displayMarkers = () => {
    if (!data.destinations) return;

    return data.destinations.map((dest, index) => {
      return (
        <Marker
          key={index}
          id={index}
          icon={{ url: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png' }}
          position={{
            lat: dest.lat,
            lng: dest.lon,
          }}
          title={dest.value && dest.value.deliveryLine}
          // onClick={() => console.log("You clicked on one of the destination markers!")}
        />
      );
    });
  };

  const mainMarker = () => {
    if (!data.details) return;

    return (
      <Marker
        icon={{ url: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png' }}
        position={{
          lat: data.details.latitude,
          lng: data.details.longitude,
        }}
        title={data.details.displayAddress}
        // onClick={() => console.log("You clicked on the main marker!")}
      />
    );
  };

  return (
    <Fragment>
      <Segment basic style={{ height: '50vh' }}>
        <Map google={google} zoom={12} containerStyle={containerStyle} initialCenter={{ lat: data.details.latitude, lng: data.details.longitude }}>
          {displayMarkers()}
          {mainMarker()}
        </Map>
      </Segment>
    </Fragment>
  );
};

GoogleMapItem.propTypes = {
  props: PropTypes.object,
};

export default GoogleApiWrapper({
  apiKey: config.googleMap.apiKey,
})(GoogleMapItem);

import PropTypes from 'prop-types';
import React, { Fragment, Component, useState } from 'react';
import { Map, GoogleApiWrapper, Marker, InfoWindow } from 'google-maps-react';

import { Header, Segment } from './Base';

const containerStyle = {
  position: 'relative',
  width: '100%',
  height: '100%',
};

const GoogleMapItem = ({ data, google }) => {
  const [showingInfoWindow, setShowingInfoWindow] = useState(false);
  const [activeMarker, setActiveMarker] = useState({});
  const [selectedPlace, setSelectedPlace] = useState({});

  onMarkerClick = (props, marker, e) => setSelectedPlace(props);
  setActiveMarker(marker);
  setShowingInfoWindow(true);

  onMapClicked = props => {
    if (props) {
      setShowingInfoWindow(false);
      setActiveMarker(null);
    }
  };

  const displayMarkers = () => {
    return (
      data.destinations &&
      data.destinations.map((dest, index) => {
        return (
          <Marker
            key={index}
            id={index}
            icon={{ url: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png' }}
            position={{
              lat: dest.lat,
              lng: dest.lon,
            }}
            title={dest?.deliveryLine}
            onClick={onMarkerClick}
          />
        );
      })
    );
  };

  const mainMarker = () => {
    return (
      <Marker
        icon={{ url: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png' }}
        position={{
          lat: data.details && data.details.latitude,
          lng: data.details && data.details.longitude,
        }}
        title={data.details && data.details.displayAddress}
        onClick={onMarkerClick}
      >
        &nsbs;
      </Marker>
    );
  };

  return (
    <Fragment>
      <Segment attached style={{ height: '50vh', top: '-1px' }}>
        <Map
          google={google}
          zoom={12}
          containerStyle={containerStyle}
          initialCenter={{
            lat: data.details && data.details.latitude,
            lng: data.details && data.details.longitude,
          }}
          onClick={onMapClicked}
        >
          {displayMarkers()}
          {mainMarker()}
          <InfoWindow marker={activeMarker} visible={showingInfoWindow}>
            <Header as="h5">{selectedPlace.title}</Header>
          </InfoWindow>
        </Map>
      </Segment>
    </Fragment>
  );
};

GoogleMapItem.propTypes = {
  props: PropTypes.object,
};

export default GoogleApiWrapper({
  apiKey: process.env.REACT_APP_GOOGLE_MAP_APP_KEY,
})(GoogleMapItem);

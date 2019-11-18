import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Segment } from 'semantic-ui-react';
import { Map, GoogleApiWrapper, Marker } from 'google-maps-react';

const containerStyle = {
  position: 'relative',
  width: '100%',
  height: '100%',
};

const GoogleMapItem = props => {
  return (
    <Fragment>
      <Segment
        basic
        style={{
          height: '50vh',
        }}
      >
        <Map
          google={props.google}
          zoom={8}
          // style={mapStyles}
          containerStyle={containerStyle}
          initialCenter={{ lat: 47.444, lng: -122.176 }}
        >
          <Marker position={{ lat: 48.0, lng: -122.0 }} />
        </Map>
      </Segment>
    </Fragment>
  );
};

GoogleMapItem.propTypes = {
  props: PropTypes.object,
};

export default GoogleApiWrapper({
  apiKey: 'AIzaSyC4iBElkDK11G-6ZbxzthqMDzzx-qGiOVY',
})(GoogleMapItem);

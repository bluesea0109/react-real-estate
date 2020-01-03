import PropTypes from 'prop-types';
import React, { Fragment, Component } from 'react';
import { Map, GoogleApiWrapper, Marker, InfoWindow } from 'google-maps-react';

import { Header, Segment } from './Base';
import config from '../config';

const containerStyle = {
  position: 'relative',
  width: '100%',
  height: '100%',
};

export class GoogleMapItem extends Component {
  state = {
    showingInfoWindow: false,
    activeMarker: {},
    selectedPlace: {},
  };

  onMarkerClick = (props, marker, e) =>
    this.setState({
      selectedPlace: props,
      activeMarker: marker,
      showingInfoWindow: true,
    });

  onMapClicked = props => {
    if (this.state.showingInfoWindow) {
      this.setState({
        showingInfoWindow: false,
        activeMarker: null,
      });
    }
  };

  render() {
    const { data, google } = this.props;

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
              title={dest.value && dest.value.deliveryLine}
              onClick={this.onMarkerClick}
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
          onClick={this.onMarkerClick}
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
            initialCenter={{ lat: data.details && data.details.latitude, lng: data.details && data.details.longitude }}
            onClick={this.onMapClicked}
          >
            {displayMarkers()}
            {mainMarker()}
            <InfoWindow marker={this.state.activeMarker} visible={this.state.showingInfoWindow}>
              <Header as="h5">{this.state.selectedPlace.title}</Header>
            </InfoWindow>
          </Map>
        </Segment>
      </Fragment>
    );
  }
}

GoogleMapItem.propTypes = {
  props: PropTypes.object,
};

export default GoogleApiWrapper({
  apiKey: config.googleMap.apiKey,
})(GoogleMapItem);

import PropTypes from 'prop-types';
import React, { Fragment, Component } from 'react';
import { GoogleMap, Marker } from '@react-google-maps/api';
import { Segment } from '../../Base';

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
    const { data } = this.props;

    let center = { lat: 44.5049368, lng: -105.7491507 };
    let zoom = 4;
    if (data.details) {
      if (data.details.latitude) center.lat = data.details.latitude;
      if (data.details.longitude) center.lng = data.details.longitude;
      zoom = 12;
    } else if (data.destinations && data.destinations.length) {
      let first = data.destinations[0];
      center.lng = first.lon;
      center.lat = first.lat;
      zoom = 12;
    }

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
              onClick={this.onMarkerClick}
            />
          );
        })
      );
    };

    const mainMarker = () => {
      return (
        <Marker
          icon={{ url: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png' }}
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
          <GoogleMap
            id="destinations-map-display"
            mapContainerStyle={containerStyle}
            zoom={zoom}
            options={{
              streetViewControl: false,
            }}
            center={center}
            onClick={this.onMapClicked}
          >
            {displayMarkers()}
            {data.details && data.details.latitude && mainMarker()}
          </GoogleMap>
        </Segment>
      </Fragment>
    );
  }
}

GoogleMapItem.propTypes = {
  props: PropTypes.object,
};

export default GoogleMapItem;

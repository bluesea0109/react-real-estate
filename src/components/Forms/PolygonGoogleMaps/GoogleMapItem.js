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

          <GoogleMap
            id="destinations-map-display"
            mapContainerStyle={containerStyle}
            zoom={12}
            center={{ lat: data.details && data.details.latitude, lng: data.details && data.details.longitude }}
            onClick={this.onMapClicked}
          >

            {displayMarkers()}
            {mainMarker()}

          </GoogleMap>

        </Segment>
      </Fragment>
    )
  }
};

GoogleMapItem.propTypes = {
  props: PropTypes.object,
};

export default GoogleMapItem

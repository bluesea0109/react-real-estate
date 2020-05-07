import React from 'react';
import { LoadScript } from '@react-google-maps/api';
import PolygonGoogleMapsCore from './PolygonGoogleMapsCore';

const loaderId = "poly-map-1";

const Loading = <div>Loading...</div>;

const googleMapsLibraries = ['drawing'];

const onLoad = () => console.log('script loaded');

const onError = err => console.log('onError: ', err);

const PolygonGoogleMapsHOC = () => {
  return (
    <LoadScript
      id={loaderId}
      googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAP_APP_KEY}
      language="en"
      region="EN"
      version="weekly"
      onLoad={onLoad}
      onError={onError}
      loadingElement={Loading}
      libraries={googleMapsLibraries}
      preventGoogleFontsLoading
    >
      <PolygonGoogleMapsCore />
    </LoadScript>
  );
};

export default PolygonGoogleMapsHOC;

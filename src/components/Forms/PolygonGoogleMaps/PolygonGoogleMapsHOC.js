import React from 'react';
import { LoadScript } from '@react-google-maps/api';


const loaderId = "poly-map-1";

const Loading = <div>Loading...</div>;

const googleMapsLibraries = ['drawing'];

const onLoad = () => console.log('script loaded');

const onError = err => console.log('onError: ', err);

const PolygonGoogleMapsHOC = ({children}) => {
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
      {children}
    </LoadScript>
  );
};

export default PolygonGoogleMapsHOC;

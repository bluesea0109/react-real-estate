import React from 'react';
import { GoogleMap, DrawingManager } from '@react-google-maps/api';

const center = {
  lat: 40.7608,
  lng: -111.8910,
};

const onClick = (...args) => {
  console.log('onClick args: ', args);
};

const onMapLoad = map => {
  console.log('map: ', map);
};

const drawingManagerOnLoad = drawingManager => {
  console.log({ drawingManager });
};

const getCoordinates = polygonArray => {
  const array = polygonArray
    .getPath()
    .getArray()
    .map(el => {
      return { lat: el.lat(), lng: el.lng() };
    });
  return array;
};

const onPolygonComplete = polygon => {
  const coordinates = getCoordinates(polygon);
  // const coordinates = polygon.getPath().getArray();
  console.log({ coordinates });
  // console.log({ZedLatVal});
};
const PolygonGoogleMapsCore = () => {
  return (
    <div className="map">
      <div className="map-container">
        <GoogleMap
          id="bicycling-example"
          mapContainerStyle={{ height: '400px', width: '100%' }}
          zoom={12}
          center={center}
          onClick={onClick}
          onLoad={onMapLoad}
        >
          <DrawingManager
            drawingMode="polygon"
            onLoad={drawingManagerOnLoad}
            onPolygonComplete={onPolygonComplete}
            options={{
              drawingControl: true,
              drawingControlOptions: {
                position: google.maps.ControlPosition.TOP_LEFT,
                drawingModes: [google.maps.drawing.OverlayType.POLYGON],
              },
            }}
          />
        </GoogleMap>
      </div>
    </div>
  );
};

export default PolygonGoogleMapsCore;

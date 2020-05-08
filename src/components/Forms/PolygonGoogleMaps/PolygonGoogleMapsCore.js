import React from 'react';
import { GoogleMap, DrawingManager } from '@react-google-maps/api';
import { Button } from '../Base';

const center = {
  lat: 40.7608,
  lng: -111.891,
};

const onClick = (...args) => {
  // console.log('onClick args: ', args);
};

const onMapLoad = map => {
  // console.log('map: ', map);
};

const drawingManagerOnLoad = drawingManager => {
  console.log({ drawingManager });
};

const getCoordinates = (polygonArray, setPolygonCoordinates) => {
  const array = polygonArray
    .getPath()
    .getArray()
    .map(el => {
      return { lat: el.lat(), lng: el.lng() };
    });
  console.warn(array);
  setPolygonCoordinates(array);
  return array;
};

let latestPolygon;

const onPolygonComplete = (polygon, setPolygonCoordinates) => {
  let coordinates = getCoordinates(polygon, setPolygonCoordinates);

  latestPolygon && latestPolygon.setMap(null);
  polygon.setEditable(true);

  google.maps.event.addListener(polygon.getPath(), 'insert_at', (index, obj) => {
    coordinates = getCoordinates(polygon, setPolygonCoordinates);
    console.log(2);
    console.log({ coordinates });
  });
  google.maps.event.addListener(polygon.getPath(), 'set_at', (index, obj) => {
    coordinates = getCoordinates(polygon, setPolygonCoordinates);
    console.log(3);
    console.log({ coordinates });
  });
  console.log('default');
  console.log({ coordinates });
  latestPolygon = polygon;
};

const PolygonGoogleMapsCore = ({ setPolygonCoordinates }) => {
  return (
    <div style={{ marginTop: '30px' }}>
      <div style={{ textAlign: 'right', marginBottom: '10px' }}>
        <Button
          secondary
          onClick={() => {
            latestPolygon.setMap(null);
            setPolygonCoordinates(null);
          }}
        >
          Delete Shape
        </Button>
      </div>
      <div className="map">
        <div className="map-container">
          <GoogleMap
            id="polygon-map-mailout"
            mapContainerStyle={{ height: '400px', width: '100%' }}
            zoom={12}
            center={center}
            onClick={onClick}
            onLoad={onMapLoad}
          >
            <DrawingManager
              drawingMode="polygon"
              onLoad={drawingManagerOnLoad}
              onPolygonComplete={(polygon) => onPolygonComplete(polygon, setPolygonCoordinates)}
              options={{
                drawingControl: true,
                drawingControlOptions: {
                  position: google.maps.ControlPosition.TOP_LEFT,
                  drawingModes: [google.maps.drawing.OverlayType.POLYGON],
                },
                polygonOptions: {
                  draggable: true,
                  clickable: true,
                  editable: true,
                },
              }}
            />
          </GoogleMap>
        </div>
      </div>
    </div>
  );
};

export default PolygonGoogleMapsCore;

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
  // console.log({ drawingManager });
};

const getCoordinates = (polygonArray, setPolygonCoordinates) => {
  const array = polygonArray
    .getPath()
    .getArray()
    .map(el => {
      return [ el.lng(), el.lat()]  ;
    });
  setPolygonCoordinates(array);
  return array;
};

let latestPolygon;

const onPolygonComplete = (polygon, setPolygonCoordinates) => {
  let coordinates = getCoordinates(polygon, setPolygonCoordinates); // eslint-disable-line

  latestPolygon && latestPolygon.setMap(null);
  polygon.setEditable(true);

  // !fix `google` global object accessing (change to _google/local scope);
  google.maps.event.addListener(polygon.getPath(), 'insert_at', (index, obj) => { // eslint-disable-line
    coordinates = getCoordinates(polygon, setPolygonCoordinates);
  });
  google.maps.event.addListener(polygon.getPath(), 'set_at', (index, obj) => { // eslint-disable-line
    coordinates = getCoordinates(polygon, setPolygonCoordinates);
  });
  latestPolygon = polygon;
};

const PolygonGoogleMapsCore = ({ setPolygonCoordinates, data }) => {
  return (
    <div style={{ marginTop: '30px' }}>

      <div className="map">
        <div className="map-container">
          <GoogleMap
            id="polygon-map-mailout"
            mapContainerStyle={{ height: '400px', width: '100%' }}
            zoom={12}
            center={{ lat: data.details && data.details.latitude, lng: data.details && data.details.longitude }}
            onClick={onClick}
            onLoad={onMapLoad}
          >
          {/* {ifLoadedPageBackIn ? <Polygon /> : <DrawingManger />} */}
            <DrawingManager
              drawingMode="polygon"
              onLoad={drawingManagerOnLoad}
              onPolygonComplete={(polygon) => onPolygonComplete(polygon, setPolygonCoordinates)}
              options={{
                drawingControl: true,
                drawingControlOptions: {
                  position: google.maps.ControlPosition.TOP_LEFT, // eslint-disable-line
                  drawingModes: [google.maps.drawing.OverlayType.POLYGON], // eslint-disable-line
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

import React from 'react';
import { GoogleMap, DrawingManager, Polygon } from '@react-google-maps/api';
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

const PolygonGoogleMapsCore = ({ polygonCoordinates, setPolygonCoordinates, data }) => {
  let path = []
  console.log('polygonCoordinates', polygonCoordinates)
  if (polygonCoordinates && polygonCoordinates.length) path = polygonCoordinates.map(c => ({lng: c[0], lat: c[1]}) )
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

            {polygonCoordinates && polygonCoordinates.length && (
              <Polygon
                path={path}
                key={1}
                editable={true}
                options={{
                   strokeColor: "#FF0000",
                   strokeOpacity: 0.8,
                   strokeWeight: 2,
                   fillColor: "#FF0000",
                   fillOpacity: 0.35
                 }}
              />
            )}
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

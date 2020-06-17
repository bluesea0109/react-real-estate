import React from 'react';
import { GoogleMap, DrawingManager, Marker, Polygon } from '@react-google-maps/api';

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
  if (polygonCoordinates && polygonCoordinates.length) path = polygonCoordinates.map(c => ({lng: c[0], lat: c[1]}) )

  let center = { lat: 44.5049368, lng: -105.7491507 }
  let zoom = 4
  if (data.details) {
    if (data.details.latitude) center.lat = data.details.latitude
    if (data.details.longitude) center.lng = data.details.longitude
    zoom = 12
  } else if (polygonCoordinates && polygonCoordinates.length) {
    let first = polygonCoordinates[0]
    center.lng = first[0]
    center.lat = first[1]
    zoom = 12
  }


  const mainMarker = () => {
    return (
      <Marker
        icon={{ url: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png' }}
        position={{
          lat: data.details && data.details.latitude,
          lng: data.details && data.details.longitude,
        }}
        title={data.details && data.details.displayAddress}
      >
        &nsbs;
      </Marker>
    );
  };


  return (
    <div style={{ marginTop: '30px' }}>

      <div className="map">
        <div className="map-container">
          <GoogleMap
            id="polygon-map-mailout"
            mapContainerStyle={{ height: '400px', width: '100%' }}
            zoom={zoom}
            options={{
              streetViewControl: false
            }}
            center={center}
            onClick={onClick}
            onLoad={onMapLoad}
          >

            {data.details && data.details.latitude && mainMarker()}

            {polygonCoordinates && polygonCoordinates.length && (
              <Polygon
                path={path}
                key={1}
                editable={true}
                options={{
                   strokeColor: "#59C4C4",
                   strokeOpacity: 0.9,
                   strokeWeight: 2,
                   fillColor: "#59C4C4",
                   fillOpacity: 0.30
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
                  strokeColor: "#59C4C4",
                  strokeOpacity: 0.9,
                  strokeWeight: 2,
                  fillColor: "#59C4C4",
                  fillOpacity: 0.30
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

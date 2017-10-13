import React from 'react';
import { render } from 'react-dom';
import { Map, Marker, Circle, Popup, TileLayer } from 'react-leaflet';


const MyMap = ({position}) => (
  <Map center={position} style={{height: "180px"}} zoom={14} minZoom={14} maxZoom={14} zoomControl={false}>
    <TileLayer
      url='http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png'
      attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attribution">CARTO<a/>'
    />
    <Circle center={position} radius={200} />
  </Map>
);

export default MyMap;

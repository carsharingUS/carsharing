import React, { useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, Polyline } from "react-leaflet";
import L, { tileLayer } from "leaflet";
import {Map } from 'leaflet';

const MapComponent = ({ route }) => {
  const [map, setMap] = useState<Map>();
  const mapInit = useRef<boolean>(false);
  const initMap = () => {
    map && tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19,
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);
  }
  useEffect(() => {
    if (!mapInit.current) {
      mapInit.current = true;
      setMap(
        new Map('map', {
          center: [-33.8676, 151.21],
          zoom: 15,
        }).setView([-33.8678, 151.21])
      )
    }
    if (map) {
      initMap();
    }
  }, [mapInit, map ])
  return (
    <div id="map"></div>
  );
}

export default MapComponent;

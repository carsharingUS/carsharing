import React, { useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Polyline } from "react-leaflet";
import L from "leaflet";

const MapComponent = ({ route }) => {
  const mapRef = useRef<any>(null);

  useEffect(() => {
    if (mapRef.current && route) {
      const map = mapRef.current.leafletElement;
      const startPoint = route.start_point;
      const endPoint = route.end_point;

      // Agregar marcador de inicio
      L.marker(startPoint).addTo(map);

      // Agregar marcador de fin
      L.marker(endPoint).addTo(map);

      // Agregar ruta
      const polyline = L.polyline(route.route, {
        weight: 8,
        color: "blue",
        opacity: 0.6,
      }).addTo(map);

      // Ajustar la vista del mapa a la ruta
      map.fitBounds(polyline.getBounds());
    }
  }, [route]);

  return (
    <MapContainer
      style={{ height: "400px", width: "100%" }}
      ref={mapRef}
      whenReady={() => {
        if (mapRef.current && route) {
          const startPoint = route.start_point;
          mapRef.current.leafletElement.setView(startPoint, 10);
        }
      }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
    </MapContainer>
  );
};

export default MapComponent;

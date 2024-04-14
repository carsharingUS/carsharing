import React, { useState, useEffect } from "react";
import Loader from "../../components/Loader";
import { getCoordinates, getTravel } from "../../api/TravelService";
import { useParams } from "react-router-dom";
import { Travel } from "../../Interfaces";
import L from "leaflet";
import "leaflet-routing-machine";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import "../travels/TravelMap.css";
import "leaflet/dist/leaflet.css";

const TravelDetails = () => {
  const { travelId } = useParams();
  const [travel, setTravel] = useState<Travel>();
  const [isLoading, setIsLoading] = useState(true);
  const [isMapLoading, setIsMapLoading] = useState(false); // Nuevo estado para controlar la carga del mapa
  const [isActive, setIsActive] = useState<boolean>(false);
  const [origin, setOrigin] = useState<{ geocode: [number, number]; popUp: string } | null>(null);
  const [destination, setDestination] = useState<{ geocode: [number, number]; popUp: string } | null>(null);

  const fetchTravel = async () => {
    try {
      if (!travelId) return;
      const travelData = await getTravel(travelId);
      setTravel(travelData);
      setIsLoading(false);
      return travelData;
    } catch (error) {
      console.error("Error fetching travel:", error);
    }
  };

  useEffect(() => {
    fetchTravel();
  }, [travelId]);
  

  const showMap = async () => {
    const travelData = await fetchTravel();
    if (!travelData) return;

    const originCoords = await getCoordinates(travelData.origin);
    const destinationCoords = await getCoordinates(travelData.destination);

    if (!originCoords || !destinationCoords) return;

    setOrigin({ geocode: [originCoords.latitude, originCoords.longitude], popUp: "Inicio" });
    setDestination({ geocode: [destinationCoords.latitude, destinationCoords.longitude], popUp: "Destino" });

    setIsMapLoading(true); // Cambiar el estado para indicar que el mapa está cargando

    setTimeout(() => {
      setIsActive(true); // Cambiar el estado para mostrar el mapa después de 1 segundo (simulando carga)
      setIsMapLoading(false); // Cambiar el estado para indicar que el mapa ha terminado de cargar
    }, 1000); // Simular carga durante 1 segundo
  };

  useEffect(() => {
    if (!isActive) return;

    const map = L.map("map");
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; <a href='https://openstreetmaps.org/copyright'>OpenStreetMap</a>",
    }).addTo(map);

    const waypoints = [
      L.latLng(origin?.geocode[0], origin?.geocode[1]),
      L.latLng(destination?.geocode[0], destination?.geocode[1]),
    ];

    L.Routing.control({
      waypoints,
      routeWhileDragging: true,
      language: "es",
    }).addTo(map);

    return () => {
      map.remove();
    };
  }, [isActive, origin, destination]);

  if (isLoading) return <Loader />;
  if (!travel) return <div>No se encontró el viaje.</div>;

  console.log(travel)

  return (
    <div>
      <h1>Detalles del viaje</h1>
      <p>Origen: {travel.origin}</p>
      <p>Destino: {travel.destination}</p>
      <button onClick={showMap}>Mostrar mapa en caja</button>
      {isMapLoading && <Loader />} {/* Mostrar loader mientras se carga el mapa */}
      {isActive && <div id="map"></div>} {/* Mostrar el mapa una vez cargado */}
    </div>
  );
};

export default TravelDetails;

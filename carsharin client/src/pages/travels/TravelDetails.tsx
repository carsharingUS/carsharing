import React, { useState, useEffect } from "react";
import Loader from "../../components/Loader";
import { getCoordinates, getTravel } from "../../api/TravelService";
import MapComponent from "../../components/map/MapComponent";
import { useParams } from "react-router-dom";
import { Travel } from "../../Interfaces";

const TravelDetails = () => {
  const { travelId } = useParams();
  const [travel, setTravel] = useState<Travel>();
  const [isLoading, setIsLoading] = useState(true);
  const [route, setRoute] = useState(null);

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

    try {
      const response = await fetch(
        `http://localhost:8000/travels/route/${originCoords.latitude},${originCoords.longitude};${destinationCoords.latitude},${destinationCoords.longitude}`
      );
      if (response.ok) {
        const routeData = await response.json();
        setRoute(routeData);
      } else {
        console.error("Error al mostrar el mapa:", response.statusText);
      }
    } catch (error) {
      console.error("Error al mostrar el mapa:", error);
    }
  };

  if (isLoading) return <Loader />;
  if (!travel) return <div>No se encontró el viaje.</div>;

  return (
    <div>
      <h1>Detalles del viaje</h1>
      <p>Origen: {travel.origin}</p>
      <p>Destino: {travel.destination}</p>
      <button onClick={showMap}>Mostrar mapa en caja</button>
      {route && <MapComponent route={route} />}
    </div>
  );
};

export default TravelDetails;

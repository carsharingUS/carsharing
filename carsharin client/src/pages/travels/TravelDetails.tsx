import React, { useState, useEffect } from "react";
import Loader from "../../components/Loader";
import { useParams } from "react-router-dom";
import { getCoordinates, getTravel } from "../../api/TravelService"; // Asegúrate de tener este método en tu archivo de servicio de API
import { Coordinates } from "../../Interfaces";

const TravelDetails = () => {
  const { travelId } = useParams();
  const [travel, setTravel] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [originCoordinates, setOriginCoordinates] =
    useState<Coordinates | null>(null);
  const [destinationCoordinates, setDestinationCoordinates] =
    useState<Coordinates | null>(null);

  useEffect(() => {
    const fetchTravel = async () => {
      try {
        if (!travelId) return;
        const travelData = await getTravel(travelId);
        setTravel(travelData);
        const originCoords = await getCoordinates(travelData.origin);
        const destinationCoords = await getCoordinates(travelData.destination);
        setOriginCoordinates(originCoords);
        setDestinationCoordinates(destinationCoords);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching travel:", error);
      }
    };

    fetchTravel();
  }, [travelId]);

  if (isLoading) return <Loader />;
  if (!travel) return <div>No se encontró el viaje.</div>;

  const showMap = async () => {
    if (!originCoordinates || !destinationCoordinates) return;
    try {
      const response = await fetch(
        `http://localhost:8000/travels/showroute/${originCoordinates.latitude},${originCoordinates.longitude};${destinationCoordinates.latitude},${destinationCoordinates.longitude}`
      );
      if (response.ok) {
        const mapHtml = await response.text();
        const mapWindow = window.open("about:blank", "_blank");
        if (mapWindow) {
          mapWindow.document.write(mapHtml);
        } else {
          console.error("No se pudo abrir la ventana del mapa.");
        }
      } else {
        console.error("Error al mostrar el mapa:", response.statusText);
      }
    } catch (error) {
      console.error("Error al mostrar el mapa:", error);
    }
  };

  return (
    <div>
      <h1>Detalles del viaje</h1>
      <p>Nombre: {travel.name}</p>
      <p>Origen: {travel.origin}</p>
      <p>Destino: {travel.destination}</p>
      <button onClick={showMap}>Mostrar mapa en nueva ventana</button>
    </div>
  );
};

export default TravelDetails;

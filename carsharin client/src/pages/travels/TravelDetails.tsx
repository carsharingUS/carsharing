import React, { useState, useEffect, ChangeEvent } from "react";
import { useParams } from "react-router-dom";
import Loader from "../../components/Loader";
import { getCoordinates, getTravel } from "../../api/TravelService";
import { Token, Travel } from "../../Interfaces";
import L from "leaflet";
import "leaflet-routing-machine";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import "../travels/TravelMap.css";
import "leaflet/dist/leaflet.css";
import { useQuery } from "@tanstack/react-query";
import { get_solo_user } from "../../api/UserService";
import { useAuthStore } from "../../store/auth";
import * as jwt_decode from "jwt-decode";
import "./TravelDetails.css"; // Importa el archivo CSS aquí
import { OpenStreetMapProvider } from 'leaflet-geosearch';


const TravelDetails = () => {
  const { travelId } = useParams();
  const [travel, setTravel] = useState<Travel>();
  const [isLoading, setIsLoading] = useState(true);
  const [isMapLoading, setIsMapLoading] = useState(false);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [origin, setOrigin] = useState<{ geocode: [number, number]; popUp: string } | null>(null);
  const [destination, setDestination] = useState<{ geocode: [number, number]; popUp: string } | null>(null);
  const [showMapContainer, setShowMapContainer] = useState(false); // Estado para controlar la visibilidad del contenedor del mapa
  const [selectedSeats, setSelectedSeats] = useState<number>(0); // Estado para almacenar la cantidad de plazas seleccionadas
  const [typingTimeout, setTypingTimeout] = useState<number>(0); // Nuevo estado para rastrear el tiempo de espera+
  const [intermedio, setIntermedio] = useState<string>("");
  const [intermedioSuggestions, setIntermedioSuggestions] = useState<Array<{ label: string }>>([]);

  const handleIntermedioChange = (event: ChangeEvent<HTMLInputElement>) => {
    setIntermedio(event.target.value);
    // Reiniciar el tiempo de espera
    clearTimeout(typingTimeout);
    // Establecer un nuevo tiempo de espera antes de realizar la búsqueda
    setTypingTimeout(setTimeout(() => searchAddresses(event.target.value, setIntermedioSuggestions), 200));
  };

  // Función para buscar sugerencias de direcciones
  const searchAddresses = async (query, setSuggestions) => {
    const provider = new OpenStreetMapProvider({
      params: {
        'accept-language': 'es',
        countrycodes: 'es',
      },
    });
    const results = await provider.search({ query });
    setSuggestions(results);
  };

  const handleIntermedioSuggestionClick = (suggestion) => {
    setOrigin(suggestion.label);
    setIntermedioSuggestions([]);
  };


  const handleSeatClick = (numSeats: number) => {
    setSelectedSeats(prevSelectedSeats => {
      // Si el mismo asiento está seleccionado, deselecciona
      if (prevSelectedSeats === numSeats) {
        return 0;
      } else {
        // De lo contrario, selecciona el asiento
        return numSeats;
      }
    });
  };

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

  const token: string = useAuthStore.getState().access;
  const tokenDecoded: Token = jwt_decode.jwtDecode(token);

  const id = tokenDecoded.user_id;

  const { data: user, isLoading: userIsLoading } = useQuery({
    queryKey: ["user", id],
    queryFn: () => get_solo_user(id),
  });

  useEffect(() => {
    fetchTravel();
  }, [travelId]);

  const showMap = async () => {
    if (isActive) {
      // Si el mapa está activo, cerrarlo
      setIsActive(false);
      setShowMapContainer(false);
    } else {
      // Si el mapa no está activo, mostrarlo
      const travelData = await fetchTravel();
      if (!travelData) return;

      const originCoords = await getCoordinates(travelData.origin);
      const destinationCoords = await getCoordinates(travelData.destination);

      if (!originCoords || !destinationCoords) return;

      setOrigin({ geocode: [originCoords.latitude, originCoords.longitude], popUp: "Inicio" });
      setDestination({ geocode: [destinationCoords.latitude, destinationCoords.longitude], popUp: "Destino" });

      setIsMapLoading(true);
      setShowMapContainer(true); // Mostrar el contenedor del mapa

      setTimeout(() => {
        setIsActive(true);
        setIsMapLoading(false);
      }, 1000);
    }
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

  const handleRequestTravel = () => {
    // Implementa la lógica para solicitar plaza en el viaje
  };

  if (isLoading || userIsLoading) return <Loader />;
  if (!travel || !user) return <div>No se encontró el viaje o el usuario.</div>;

  const isCurrentUserOwner = user.id === travel.host?.id;

  return (
    <div className="travel-details-container" style={{ padding: "20px 20px 50px" }}>
      <h1 className="travel-details-title">Detalles del viaje</h1>
      <p>Origen: {travel.origin}</p>
      <p>Destino: {travel.destination}</p>
      {isCurrentUserOwner ? (
        <div>
          <button className="travel-details-request-btn" onClick={showMap}>
            {isActive ? "Cerrar mapa" : "Mostrar mapa en caja"}
          </button>
          {showMapContainer && isActive && (
            <div className={`map-container ${isActive ? "open" : ""}`} >
              <div>{isMapLoading && <Loader />}</div>
              <div className="map" id="map"></div>
            </div>
          )}
        </div>
      ) : (
        <div>
          <br />
          <form className="travel-details-form" onSubmit={handleRequestTravel}>
          <div className="input-group">
      <label htmlFor="seats" className="label">
        Número de plazas
      </label>
      &nbsp;
      &nbsp;
      &nbsp;
      <div className="seat-input-container">
        <div className="seat-icons-container">
          {Array.from({length: travel.total_seats}, (_, i) => i + 1).map((numSeats) => (
            <div
              key={numSeats}
              className={`seat-icon ${numSeats <= selectedSeats ? 'selected' : ''}`}
              onClick={() => handleSeatClick(numSeats)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="24"
                height="24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="feather feather-user"
              >
                <path 
                d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"
                ></path>
                <circle
                cx="12"
                cy="7"
                r="4">
                </circle>
              </svg>
            </div>
          ))}
        </div>
      </div>
    </div>
    <div className="input-group">

    <label className="travel-details-label">
              Estación intermedia (opcional):
    </label>
    <input
              value={intermedio}
              type="text"
              onChange={handleIntermedioChange}
              name="intermedio"
              autoComplete="off"
              id="intermedio"
              className="input"
              placeholder="Calle Ejemplo, Ciudad Ejemplo, Provincia Ejemplo"
            />
    {intermedioSuggestions.length > 0 && (
              <div className="suggestions-container">
                <div className="suggestions">
                  {intermedioSuggestions.slice(0, 5).map((suggestion, index) => (
                    <div
                      key={index}
                      className="suggestion"
                      onClick={() => handleIntermedioSuggestionClick(suggestion)}
                    >
                      {suggestion?.label}
                    </div>
                  ))}
                </div>
              </div>
            )}

    </div>
            
            <button type="submit" className="travel-details-submit-btn">Solicitar viaje</button>
          </form>
          <button className="travel-details-request-btn" onClick={showMap}>
            {isActive ? "Cerrar mapa" : "Mostrar mapa en caja"}
          </button>
          {showMapContainer && isActive && (
            <div className={`map-container ${isActive ? "open" : ""}`}>
              <div>{isMapLoading && <Loader />}</div>
              <div className="map2" id="map"></div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TravelDetails;

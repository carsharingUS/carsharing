import React, { useState, useEffect, ChangeEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Loader from "../../components/Loader";
import {
  getCoordinates,
  getTravel,
  createTravelRequest,
  deleteTravel,
} from "../../api/TravelService";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { Token, Travel, TravelRequest } from "../../Interfaces";
import L from "leaflet";
import "leaflet-routing-machine";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import "../travels/TravelMap.css";
import "leaflet/dist/leaflet.css";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "../../store/auth";
import * as jwt_decode from "jwt-decode";
import "./TravelDetails.css"; // Importa el archivo CSS aquí
import { OpenStreetMapProvider } from "leaflet-geosearch";
import { getCurrentUser } from "../../utils";
import toast from "react-hot-toast";
import { getWebsocketToken, get_solo_user } from "../../api/UserService";
import Navbar from "../../components/home/Navbar";
import { IconButton } from "@mui/material";
import dayjs from "dayjs";

const TravelDetails = () => {
  const { travelId = "" } = useParams<{ travelId?: string }>();
  const [travel, setTravel] = useState<Travel>();
  const [isLoading, setIsLoading] = useState(true);
  const [isMapLoading, setIsMapLoading] = useState(false);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [modalIsActive, setModalIsActive] = useState<boolean>(false);
  const [origin, setOrigin] = useState<{
    geocode: [number, number];
    popUp: string;
  } | null>(null);
  const [destination, setDestination] = useState<{
    geocode: [number, number];
    popUp: string;
  } | null>(null);
  const [showMapContainer, setShowMapContainer] = useState(false); // Estado para controlar la visibilidad del contenedor del mapa
  const [selectedSeats, setSelectedSeats] = useState<number>(0); // Estado para almacenar la cantidad de plazas seleccionadas
  const [typingTimeout, setTypingTimeout] = useState<number>(0); // Nuevo estado para rastrear el tiempo de espera+
  const [intermedio, setIntermedio] = useState<string>("");
  const [intermedioCoordenadas, setIntermedioCoordenadas] = useState<{
    geocode: [number, number];
    popUp: string;
  } | null>(null);
  const [intermedioSuggestions, setIntermedioSuggestions] = useState<
    Array<{ label: string }>
  >([]);
  const [isIntermedioTyping, setIsIntermedioTyping] = useState(false);
  const navigate = useNavigate();

  const handleIntermedioChange = (event: ChangeEvent<HTMLInputElement>) => {
    setIntermedio(event.target.value);
    setIsIntermedioTyping(true);
    // Reiniciar el tiempo de espera
    clearTimeout(typingTimeout);
    // Establecer un nuevo tiempo de espera antes de realizar la búsqueda
    setTypingTimeout(
      setTimeout(
        () => searchAddresses(event.target.value, setIntermedioSuggestions),
        200
      )
    );
  };

  const handleUpdateMap = () => {
    setIsIntermedioTyping(false); // Reinicia el estado que indica si el usuario está escribiendo en el campo de Estación intermedia
    showMap(); // Llama a la función para mostrar el mapa
  };

  // Función para buscar sugerencias de direcciones
  const searchAddresses = async (query, setSuggestions) => {
    const provider = new OpenStreetMapProvider({
      params: {
        "accept-language": "es",
        countrycodes: "es",
      },
    });
    const results = await provider.search({ query });
    setSuggestions(results);
  };

  const handleIntermedioSuggestionClick = (suggestion) => {
    setIntermedio(suggestion.label);
    setIntermedioSuggestions([]);
  };

  const handleSeatClick = (numSeats: number) => {
    setSelectedSeats((prevSelectedSeats) => {
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
      console.log(travelData);
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

      if (intermedio !== "") {
        const intermedioCoords2 = await getCoordinates(intermedio);

        if (!intermedioCoords2) return;

        setIntermedioCoordenadas({
          geocode: [intermedioCoords2.latitude, intermedioCoords2.longitude],
          popUp: "Estación intermedia",
        });
      }

      if (!originCoords || !destinationCoords) return;

      setOrigin({
        geocode: [originCoords.latitude, originCoords.longitude],
        popUp: "Inicio",
      });
      setDestination({
        geocode: [destinationCoords.latitude, destinationCoords.longitude],
        popUp: "Destino",
      });

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
      attribution:
        "&copy; <a href='https://openstreetmaps.org/copyright'>OpenStreetMap</a>",
    }).addTo(map);

    if (
      intermedioCoordenadas === null &&
      origin !== null &&
      destination !== null
    ) {
      // Define los puntos de origen, destino e intermedio
      const waypointsOriginal = [
        L.latLng(origin?.geocode[0], origin?.geocode[1]),
        L.latLng(destination?.geocode[0], destination?.geocode[1]),
      ];

      L.Routing.control({
        waypoints: waypointsOriginal,
        routeWhileDragging: false,
        draggableWaypoints: false,
        addWaypoints: false,
        language: "es",
        lineOptions: {
          styles: [{ color: "blue", opacity: 0.6, weight: 4 }],
        },
      }).addTo(map);
    } else if (
      intermedioCoordenadas !== null &&
      origin !== null &&
      destination !== null
    ) {
      const waypointsNuevo = [
        L.latLng(origin?.geocode[0], origin?.geocode[1]),
        L.latLng(
          intermedioCoordenadas?.geocode[0],
          intermedioCoordenadas?.geocode[1]
        ),
        L.latLng(destination?.geocode[0], destination?.geocode[1]),
      ];

      L.Routing.control({
        waypoints: waypointsNuevo,
        routeWhileDragging: false,
        draggableWaypoints: false,
        addWaypoints: false,
        language: "es",
        lineOptions: {
          styles: [{ color: "red", opacity: 0.6, weight: 4 }],
        },
      }).addTo(map);
    }

    return () => {
      map.remove();
    };
  }, [isActive, origin, destination, intermedioCoordenadas]);

  const queryClient = useQueryClient();

  const createTravelRequestMutation = useMutation({
    mutationFn: createTravelRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["travelRequests"] });
      toast.success("Travel request created!");
      navigate("/");
    },
    onError: () => {
      toast.error("Error!");
      navigate("/");
    },
  });
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    createTravelRequestMutation.mutate({
      user: user, // Usuario que solicita el viaje
      travel: travel, // Viaje al que solicita el usuario
      intermediate: intermedio, // Estación intermedia (si la hay)
      seats: selectedSeats, // Número de asientos solicitados
    });
  };

  const handleChatClick = async () => {
    if (travel?.host?.id) {
      const token = await getWebsocketToken(user.id, travel.host.id);
      navigate(`chat/room/${token.websocket_token}`);
    } else {
      console.error("No se pudo obtener el ID del host del viaje.");
    }
  };

  const handleEditClick = () => {
    navigate(`./edit`);
  };

  const handleDeleteClick = async () => {
    await deleteTravel(travelId);
    navigate("/my_travels");
    toast.success("Viaje eliminado correctamente");
  };

  const showModal = async () => {
    console.log(modalIsActive);
    if (modalIsActive) {
      setModalIsActive(false);
    } else {
      setModalIsActive(true);
    }
  };

  if (isLoading || userIsLoading) return <Loader />;
  if (!travel || !user) return <div>No se encontró el viaje o el usuario.</div>;

  const isCurrentUserOwner = user.id === travel.host?.id;

  return (
    <div>
      <Navbar />
      <div
        className="travel-details-container"
        style={{ padding: "20px 20px 50px", position: "relative" }}
      >
        <h1 className="travel-details-title">Detalles del viaje</h1>
        {isCurrentUserOwner ? (
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <IconButton onClick={handleEditClick}>
              <EditIcon />
            </IconButton>
            <IconButton onClick={showModal}>
              <DeleteIcon />
            </IconButton>
          </div>
        ) : (
          <p>{""}</p>
        )}
        <div className="path-container">
          <div className="origin-container">
            <span className="origin">{travel.origin}</span>
          </div>
          <div className="dots-arrow-container">
            <div className="dots-arrow"></div>
          </div>
          <div className="destination-container">
            <span className="destination">{travel.destination}</span>
          </div>
        </div>
        <div
          style={{
            marginTop: "10px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <div
            style={{ display: "flex", flexWrap: "wrap", marginLeft: "3rem" }}
          >
            <div className="info-column">
              <div className="info-item">
                <p style={{ marginBottom: "5px" }}>
                  Anfitrión: {travel.host?.name}
                </p>
                <p>Duración estimada: {travel.estimated_duration}</p>
              </div>
              <div className="info-item">
                <p>Precio por plaza: {travel.price}</p>
                <p>
                  Fecha de salida:{" "}
                  {dayjs(travel.start_date).format("DD/MM/YYYY HH:mm")}
                </p>
              </div>
            </div>
          </div>
          <div
            style={{
              justifyContent: "flex-end",
              margin: "5rem 0 1rem",
            }}
          >
            <div className={`status-cylinder status-${travel.status}`}>
              <p className="status-text">{travel.status}</p>
            </div>
          </div>
        </div>

        {isCurrentUserOwner ? (
          <div>
            <div className="buttons-container">
              {modalIsActive && (
                <div className="modal">
                  <div className="modal-content">
                    <p>¿Estás seguro de querer eliminarlo?</p>
                    <button
                      className="travel-details-request-btn"
                      onClick={handleDeleteClick}
                    >
                      Confirmar
                    </button>
                    <button
                      className="travel-details-request-btn"
                      onClick={showModal}
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              )}

              <button className="travel-details-request-btn" onClick={showMap}>
                {isActive ? "Cerrar mapa" : "Mostrar mapa"}
              </button>
            </div>
            <div>{isMapLoading && <Loader />}</div>
            {showMapContainer && isActive && (
              <div className={`map-container ${isActive ? "open" : ""}`}>
                <div className="map" id="map"></div>
              </div>
            )}
          </div>
        ) : (
          <div>
            <br />
            <form className="travel-details-form" onSubmit={handleSubmit}>
              <div className="input-group">
                <label htmlFor="seats" className="label">
                  Número de plazas
                </label>
                <div className="seat-input-container">
                  <div className="seat-icons-container">
                    {Array.from(
                      { length: travel.total_seats },
                      (_, i) => i + 1
                    ).map((numSeats) => (
                      <div
                        key={numSeats}
                        className={`seat-icon ${
                          numSeats <= selectedSeats ? "selected" : ""
                        }`}
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
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                          <circle cx="12" cy="7" r="4"></circle>
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
                  style={{ width: "80%" }}
                  placeholder="Calle Ejemplo, Ciudad Ejemplo, Provincia Ejemplo"
                />
                {isActive && showMapContainer && isIntermedioTyping && (
                  <button
                    className="update-map-button"
                    onClick={handleUpdateMap}
                  >
                    Actualizar mapa
                  </button>
                )}
                {intermedioSuggestions.length > 0 && (
                  <div className="suggestions-container">
                    <div className="suggestions">
                      {intermedioSuggestions
                        .slice(0, 5)
                        .map((suggestion, index) => (
                          <div
                            key={index}
                            className="suggestion"
                            onClick={() =>
                              handleIntermedioSuggestionClick(suggestion)
                            }
                          >
                            {suggestion?.label}
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </div>
              <div className="buttons-container">
                <button type="submit" className="travel-details-submit-btn">
                  Solicitar viaje
                </button>
                <button
                  type="button"
                  className="travel-details-chat-btn"
                  onClick={handleChatClick}
                >
                  Chatear
                </button>
                
              </div>
            </form>
            <button
                  className="travel-details-request-btn"
                  onClick={showMap}
                >
                  {isActive ? "Cerrar mapa" : "Mostrar mapa"}
            </button>
            <div>{isMapLoading && <Loader />}</div>
            {showMapContainer && isActive && (
              <div className={`map-container ${isActive ? "open" : ""}`}>
                <div className="map2" id="map"></div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TravelDetails;

import React, { useEffect, useState } from "react";
import { Token, TravelRequest } from "../../Interfaces";
import { useNavigate, useParams } from "react-router-dom";
import {
  acceptTravelRequest,
  declineTravelRequest,
  getCoordinates,
  getRequestTravel,
} from "../../api/TravelService";
import Loader from "../Loader";
import { toast } from "react-hot-toast";
import "../notifications/TravelRequestManagment.css";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "leaflet-routing-machine";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import { getWebsocketToken, get_solo_user } from "../../api/UserService";
import { useAuthStore } from "../../store/auth";
import { useQuery } from "@tanstack/react-query";
import * as jwt_decode from "jwt-decode";
import Navbar from "../home/Navbar";
import dayjs from "dayjs";

const TravelRequestManagment = () => {
  const navigate = useNavigate();
  const { travelRequestId = "" } = useParams();
  const [travelRequest, setTravelRequest] = useState<TravelRequest | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [isMapLoading, setIsMapLoading] = useState(false);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [showMapContainer, setShowMapContainer] = useState(false);
  const [intermedioCoordenadas, setIntermedioCoordenadas] = useState<{
    geocode: [number, number];
    popUp: string;
  } | null>(null);
  const [origin, setOrigin] = useState<{
    geocode: [number, number];
    popUp: string;
  } | null>(null);
  const [destination, setDestination] = useState<{
    geocode: [number, number];
    popUp: string;
  } | null>(null);
  const [isRequestProcessed, setIsRequestProcessed] = useState(false);

  const token: string = useAuthStore.getState().access;
  const tokenDecoded: Token = jwt_decode.jwtDecode(token);

  const id = tokenDecoded.user_id;

  const { data: user, isLoading: userIsLoading } = useQuery({
    queryKey: ["user", id],
    queryFn: () => get_solo_user(id),
  });

  useEffect(() => {
    const fetchTravelRequest = async () => {
      try {
        const response = await getRequestTravel(travelRequestId);
        setTravelRequest(response);
        setIsLoading(false);
      } catch (error) {
        console.error("Error al obtener la solicitud de viaje:", error);
        setIsLoading(false);
        if (
          error.response &&
          error.response.data.error === "La solicitud ya ha sido procesada"
        ) {
          toast.error("La solicitud ya ha sido procesada");
          setIsRequestProcessed(true);
        } else {
          toast.error("Error al obtener la solicitud de viaje");
        }
      }
    };
    fetchTravelRequest();
  }, [travelRequestId]);

  const showMap = async () => {
    if (isActive) {
      setIsActive(false);
      setShowMapContainer(false);
    } else {
      if (travelRequest?.travel && travelRequest.intermediate != "") {
        const originCoords = await getCoordinates(travelRequest?.travel.origin);
        const destinationCoords = await getCoordinates(
          travelRequest?.travel.destination
        );

        const intermedioCoords2 = await getCoordinates(
          travelRequest?.intermediate
        );

        if (!intermedioCoords2) return;

        setIntermedioCoordenadas({
          geocode: [intermedioCoords2.latitude, intermedioCoords2.longitude],
          popUp: "Estación intermedia",
        });

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
        setShowMapContainer(true);

        setTimeout(() => {
          setIsActive(true);
          setIsMapLoading(false);
        }, 1000);
      }
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

  const handleAcceptRequest = async () => {
    try {
      await acceptTravelRequest(travelRequest?.id);
      toast.success("Petición aceptada!");
      navigate("/");
    } catch (error) {
      console.error("Error al aceptar la solicitud de viaje:", error);
      toast.error("Error al aceptar la solicitud de viaje");
    }
  };

  const handleRejectRequest = async () => {
    try {
      await declineTravelRequest(travelRequest?.id);
      toast.success("Petición rechazada");
      navigate("/");
    } catch (error) {
      console.error("Error al rechazar la solicitud de viaje:", error);
      toast.error("Error al rechazar la solicitud de viaje");
    }
  };

  const handleMessageUser = async () => {
    if (travelRequest?.user?.id) {
      const token = await getWebsocketToken(travelRequest?.user?.id, user.id);
      navigate(`../chat/room/${token.websocket_token}`);
    } else {
      console.error("No se pudo obtener el ID del host del viaje.");
    }
  };

  if (isLoading) return <Loader />;
  if (!travelRequest && !isRequestProcessed)
    return <div>No se encontró el viaje o el usuario.</div>;
  if (!travelRequest && isRequestProcessed)
    return <div>Esta solicitud ya ha sido procesada.</div>;

  return (
    <>
      <Navbar />
      <div className="travel-request-management-container">
        <div className="travel-request-details">
          <div className="travel-request-title">Gestionar solicitud</div>

          <div className="travel-request-text large">
            Origen: {travelRequest?.travel?.origin}
          </div>
          <div className="travel-request-text large">
            Destino: {travelRequest?.travel?.destination}
          </div>
          <div className="travel-request-text large">
            Solicitante: {travelRequest?.user?.name}
          </div>
          <div className="travel-request-text spaced">
            Fecha de Inicio:{" "}
            {dayjs(travelRequest?.travel?.start_date).format(
              "DD/MM/YYYY HH:mm"
            )}
          </div>
          <div className="travel-request-text">
            Precio: {travelRequest?.travel?.price} €
          </div>
          <div className="travel-request-text">
            Número de asientos solicitados: {travelRequest?.seats}
          </div>
          <div className="action-buttons">
            <button className="accept-button" onClick={handleAcceptRequest}>
              Aceptar
            </button>
            <button className="reject-button" onClick={handleRejectRequest}>
              Rechazar
            </button>
            <button className="message-button" onClick={handleMessageUser}>
              Enviar Mensaje
            </button>
          </div>
          {travelRequest?.intermediate && (
            <div>
              <button className="show-route-button" onClick={showMap}>
                {isActive ? "Cerrar mapa" : "Mostrar Nueva Ruta"}
              </button>
              {showMapContainer && isActive && (
                <div
                  className={`map-container-travel-request ${
                    isActive ? "open" : ""
                  }`}
                >
                  <div>{isMapLoading && <Loader />}</div>
                  <div className="map-travel-request" id="map"></div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default TravelRequestManagment;

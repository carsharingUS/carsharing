import React, { useEffect, useState } from 'react';
import { TravelRequest } from '../../Interfaces';
import { useNavigate, useParams } from 'react-router-dom';
import { acceptTravelRequest, declineTravelRequest, getCoordinates, getRequestTravel } from '../../api/TravelService';
import Loader from '../Loader';
import { toast } from "react-hot-toast";
import "../notifications/TravelRequestManagment.css"
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "leaflet-routing-machine";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";

const TravelRequestManagment = () => {
    const navigate = useNavigate();
    const { travelRequestId = '' } = useParams();
    const [travelRequest, setTravelRequest] = useState<TravelRequest | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isMapLoading, setIsMapLoading] = useState(false);
    const [isActive, setIsActive] = useState<boolean>(false);
    const [showMapContainer, setShowMapContainer] = useState(false); // Estado para controlar la visibilidad del contenedor del mapa
    const [intermedioCoordenadas, setIntermedioCoordenadas] = useState<{ geocode: [number, number]; popUp: string } | null>(null);
    const [origin, setOrigin] = useState<{ geocode: [number, number]; popUp: string } | null>(null);
    const [destination, setDestination] = useState<{ geocode: [number, number]; popUp: string } | null>(null);
    const [isRequestProcessed, setIsRequestProcessed] = useState(false);

    useEffect(() => {
      const fetchTravelRequest = async () => {
        try {
          const response = await getRequestTravel(travelRequestId);
          setTravelRequest(response);
          setIsLoading(false);
        } catch (error) {
          console.error('Error al obtener la solicitud de viaje:', error);
          setIsLoading(false);
          if (error.response && error.response.data.error === 'La solicitud ya ha sido procesada') {
            toast.error('La solicitud ya ha sido procesada');
            setIsRequestProcessed(true);
          } else {
            toast.error('Error al obtener la solicitud de viaje');
          }
        }
      };
      fetchTravelRequest();
    }, [travelRequestId]);


    const showMap = async () => {
        if (isActive) {
          // Si el mapa está activo, cerrarlo
          setIsActive(false);
          setShowMapContainer(false);
        } else {
          // Si el mapa no está activo, mostrarlo
          if (travelRequest?.travel && travelRequest.intermediate != ""){
            const originCoords = await getCoordinates(travelRequest?.travel.origin);
            const destinationCoords = await getCoordinates(travelRequest?.travel.destination);

            const intermedioCoords2 = await getCoordinates(travelRequest?.intermediate);
    
            if (!intermedioCoords2) return;
    
            setIntermedioCoordenadas({ geocode: [intermedioCoords2.latitude, intermedioCoords2.longitude], popUp: "Estación intermedia"})
          
    
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
    } 
      };
    
      useEffect(() => {
        if (!isActive) return;
    
        const map = L.map("map");
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: "&copy; <a href='https://openstreetmaps.org/copyright'>OpenStreetMap</a>",
        }).addTo(map);
    
        
    
        if(intermedioCoordenadas === null && origin !== null && destination !== null){
    
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
              styles: [{ color: 'blue', opacity: 0.6, weight: 4 }]
            }
          }).addTo(map);
    
        }else if(intermedioCoordenadas !== null && origin !== null && destination !== null){
    
          const waypointsNuevo = [
            L.latLng(origin?.geocode[0], origin?.geocode[1]),
            L.latLng(intermedioCoordenadas?.geocode[0], intermedioCoordenadas?.geocode[1]),
            L.latLng(destination?.geocode[0], destination?.geocode[1]),
          ];
    
          L.Routing.control({
            waypoints: waypointsNuevo,
            routeWhileDragging: false,
            draggableWaypoints: false, 
            addWaypoints: false,
            language: "es",
            lineOptions: {
              styles: [{ color: 'red', opacity: 0.6, weight: 4 }]
            }
          }).addTo(map);
        }
    
        return () => {
          map.remove();
        };
      }, [isActive, origin, destination, intermedioCoordenadas]);

      const handleAcceptRequest = async () => {
        try {
          await acceptTravelRequest(travelRequest?.id);
          toast.success('Petición aceptada!');
          navigate('/');
        } catch (error) {
          console.error('Error al aceptar la solicitud de viaje:', error);
          toast.error('Error al aceptar la solicitud de viaje');
        }
      };

      const handleRejectRequest = async () => {
        try {
          await declineTravelRequest(travelRequest?.id);
          toast.success('Petición rechazada');
          navigate('/');
        } catch (error) {
          console.error('Error al rechazar la solicitud de viaje:', error);
          toast.error('Error al rechazar la solicitud de viaje');
        }
      };

    const handleMessageUser = () => {
        // Lógica para enviar un mensaje al usuario que solicitó el viaje
    };
    console.log(isRequestProcessed)
    if (isLoading) return <Loader />;
    if (!travelRequest && !isRequestProcessed) return <div>No se encontró el viaje o el usuario.</div>;
    if (!travelRequest && isRequestProcessed) return <div>Esta solicitud ya ha sido procesada.</div>
    
    // Aquí puedes renderizar el contenido del componente utilizando los datos de travelRequest
    return (
        <div className="travel-request-management-container">
            <h2>Aceptar Solicitud de Viaje</h2>

            <div className="travel-request-details">
                <p>Usuario: {travelRequest?.user?.name}</p>
                <p>Origen: {travelRequest?.travel?.origin}</p>
                <p>Destino: {travelRequest?.travel?.destination}</p>
                <p>Fecha de Inicio: {travelRequest?.travel?.start_date}</p>
                <p>Precio: {travelRequest?.travel?.price}</p>
                <p>Número de Asientos Solicitados: {travelRequest?.seats}</p>
                {travelRequest?.intermediate && (
                    <div>
                    <button className="show-route-button" onClick={showMap}>
                      {isActive ? "Cerrar mapa" : "Mostrar Nueva Ruta"}
                    </button>
                    {showMapContainer && isActive && (
                      <div className={`map-container-travel-request ${isActive ? "open" : ""}`} >
                        <div>{isMapLoading && <Loader />}</div>
                        <div className="map-travel-request" id="map"></div>
                      </div>
                    )}
                  </div>
                )}
            </div>
            <div className="action-buttons">
                <button className="accept-button" onClick={handleAcceptRequest}>Aceptar</button>
                <button className="reject-button" onClick={handleRejectRequest}>Rechazar</button>
                <button className="message-button" onClick={handleMessageUser}>Enviar Mensaje</button>
            </div>
        </div>
    );
};

export default TravelRequestManagment;

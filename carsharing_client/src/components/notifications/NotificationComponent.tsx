import React, { useEffect, useState } from 'react'
import { getRequestLikeHost } from '../../api/TravelService'
import { Token, TravelRequest } from '../../Interfaces';
import * as jwt_decode from "jwt-decode";
import { useAuthStore } from '../../store/auth';
import TravelRequestCard from './TravelRequestCard';
import '../notifications/TravelRequest.css'
import toast from 'react-hot-toast';

const NotificationComponent = () => {

    const [travelRequests, setTravelRequests] = useState<TravelRequest[]>([]);

    const token: string = useAuthStore.getState().access;
    const tokenDecoded: Token = jwt_decode.jwtDecode(token);

    const user_id = tokenDecoded.user_id;

    useEffect(() => {
        const fetchTravelRequests = async () => {
          try {
            const notifications = await getRequestLikeHost(user_id.toString()); // Realizar la petición al backend
            setTravelRequests(notifications);
          } catch (error) {
            toast.error("Error al recuperar las notificaciones")
            console.error('Error fetching notifications:', error);
          }
        };
    
        fetchTravelRequests();
      }, []);
      

    return (
        <div className="travel-request-list">
        <div className="chats-header mt-4">Solicitudes de Viaje</div>
        <br />
        {travelRequests.length > 0 ? (
          travelRequests.map(request => (
            <TravelRequestCard key={request.id} request={request} />
          ))
        ) : (
          <div className="flex min-h-full items-center justify-center">
            <h2>No hay solicitudes pendientes para sus viajes publicados</h2>
          </div>
        )}
      </div>
    )
}

export default NotificationComponent

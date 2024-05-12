import React, { useEffect, useState } from 'react'
import { getRequestLikeHost } from '../../api/TravelService'
import { Token, TravelRequest } from '../../Interfaces';
import * as jwt_decode from "jwt-decode";
import { useAuthStore } from '../../store/auth';
import TravelRequestCard from './TravelRequestCard';
import '../notifications/TravelRequest.css'

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
            console.error('Error fetching notifications:', error);
          }
        };
    
        fetchTravelRequests();
      }, []);
      

    return (
        <div className="travel-request-list">
        <h2>Solicitudes de Viaje</h2>
        <br />
        {travelRequests.length > 0 ? (
          travelRequests.map(request => (
            <TravelRequestCard key={request.id} request={request} />
          ))
        ) : (
          <p>No hay solicitudes pendientes para sus viajes publicados.</p>
        )}
      </div>
    )
}

export default NotificationComponent

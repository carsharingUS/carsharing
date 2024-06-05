import React, { useEffect, useState } from "react";
import { getRequestLikeHost } from "../../api/TravelService";
import { Token, TravelRequest } from "../../Interfaces";
import * as jwt_decode from "jwt-decode";
import { useAuthStore } from "../../store/auth";
import TravelRequestCard from "./TravelRequestCard";
import "../notifications/TravelRequest.css";

const NotificationComponent = () => {
  const [travelRequests, setTravelRequests] = useState<TravelRequest[]>([]);
  const [travelRequestsPending, setTravelRequestsPending] = useState<
    TravelRequest[]
  >([]);
  const [selectedTab, setSelectedTab] = useState("pending");

  const token: string = useAuthStore.getState().access;
  const tokenDecoded: Token = jwt_decode.jwtDecode(token);

  const user_id = tokenDecoded.user_id;

  useEffect(() => {
    const fetchTravelRequests = async () => {
      try {
        const notifications = await getRequestLikeHost(user_id.toString()); // Realizar la petición al backend
        const parsedNotifications = notifications.map((notification) => {
          return {
            ...notification,
            status: notification.status || "pendiente",
          };
        });

        setTravelRequests(
          parsedNotifications.filter(
            (request) =>
              request.status === "rechazado" || request.status === "aceptado"
          )
        );
        setTravelRequestsPending(
          parsedNotifications.filter(
            (request) => request.status === "pendiente"
          )
        );
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchTravelRequests();
  }, []);

  // Manejador para cambiar entre pestañas
  const handleTabChange = (tab) => {
    setSelectedTab(tab);
  };

  return (
    <div>
      <div className="travel-request-list-container">
        <div className="travel-request-container">
          <div
            className={`travel-request-button ${
              selectedTab === "pending" ? "active" : ""
            }`}
            onClick={() => handleTabChange("pending")}
          >
            Pendientes
          </div>
          <div className="travel-request-separator"></div>
          <div
            className={`travel-request-button ${
              selectedTab === "determined" ? "active" : ""
            }`}
            onClick={() => handleTabChange("determined")}
          >
            Determinadas
          </div>
        </div>
        <div className="travel-request-content-container">
          {selectedTab === "pending" ? (
            <div className="travel-request-cards-container">
              {travelRequestsPending.length > 0 ? (
                travelRequestsPending.map((request) => (
                  <TravelRequestCard key={request.id} request={request} />
                ))
              ) : (
                <p>No hay notificaciones pendientes.</p>
              )}
            </div>
          ) : (
            <div className="travel-request-cards-container">
              {travelRequests.length > 0 ? (
                travelRequests.map((request) => (
                  <TravelRequestCard key={request.id} request={request} />
                ))
              ) : (
                <p>No hay notificaciones determinadas.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationComponent;

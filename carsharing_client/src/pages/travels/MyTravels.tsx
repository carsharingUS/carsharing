import React, { useState } from "react";
import { getUserTravels, getUserTravelsAsPassenger } from "../../api/TravelService"; // Importa la función getUserTravelsAsPassenger
import { Travel } from "../../Interfaces";
import TravelCard from "../../components/travels/TravelCard";
import Navbar from "../../components/home/Navbar";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import Loader from "../../components/Loader";
import "./MyTravels.css";

const TravelListWithTabs = () => {
  const [selectedTab, setSelectedTab] = useState("myTravels");

  // Query para obtener los viajes del usuario
  const { data: userTravels, isError: isUserTravelsError, isLoading: isUserTravelsLoading } = useQuery({
    queryKey: ["travels"],
    queryFn: getUserTravels,
  });

  // Función para obtener los viajes en los que el usuario es pasajero
  const { data: userTravelsAsPassenger, isError: isUserTravelsAsPassengerError, isLoading: isUserTravelsAsPassengerLoading } = useQuery({
    queryKey: ["travelsAsPassenger"],
    queryFn: getUserTravelsAsPassenger,
    enabled: selectedTab === "passengerTravels", // Habilita la llamada solo cuando se selecciona la pestaña "Viajes como pasajero"
  });

  

  // Manejador para cambiar entre pestañas
  const handleTabChange = (tab) => {
    setSelectedTab(tab);
  };

  // Renderizar carga o error mientras se obtienen los datos
  if (isUserTravelsError || isUserTravelsAsPassengerError) return toast.error("Error!");
  if (isUserTravelsLoading || (selectedTab === "passengerTravels" && isUserTravelsAsPassengerLoading)) return <Loader />;

  return (
    <div>
      <Navbar />
      <div className="travel-list-container">
        <div className="tabs-container">
          <div
            className={`tab-button ${selectedTab === "myTravels" ? "active" : ""}`}
            onClick={() => handleTabChange("myTravels")}
          >
            Mis Viajes
          </div>
          <div className="separator"></div>
          <div
            className={`tab-button ${selectedTab === "passengerTravels" ? "active" : ""}`}
            onClick={() => handleTabChange("passengerTravels")}
          >
            Viajes como pasajero
          </div>
        </div>
        <div className="content-container">
          {selectedTab === "myTravels" ? (
            <div className="travel-cards-container">
              {userTravels.length === 0 ? (
                <div className="no-travels-message">
                  <h2>No tienes ningún viaje publicado aún</h2>
                </div>
              ) : (
                userTravels.map((travel: Travel) => (
              
                  <TravelCard key={travel.id} travel={travel} status={travel.status} />
                ))
              )}
            </div>
          ) : (
            <div className="travel-cards-container">
              {userTravelsAsPassenger.length === 0 ? (
                <div className="no-travels-message">
                  <h2>No tienes ningún viaje como pasajero</h2>
                </div>
              ) : (
                userTravelsAsPassenger.map((travel: Travel) => (
                  <TravelCard key={travel.id} travel={travel} status={travel.status} />
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TravelListWithTabs;

import React, { useState, useEffect } from "react";
import { getTravels } from "../../api/TravelService";
import { Travel } from "../../Interfaces";
import TravelCard from "../../components/travels/TravelCard";
import Navbar from "../../components/home/Navbar";
import "../../components/travels/TravelCard.css";
import Loader from "../../components/Loader";
import toast from "react-hot-toast";
import NoTravelFound from "../../components/travels/NoTravelFound";

const Travels = () => {
  const [travels, setTravels] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const searchParams = new URLSearchParams(location.search);

  useEffect(() => {
    const origin = searchParams.get("origin") || "";
    const destination = searchParams.get("destination") || "";
    const start_date = searchParams.get("start_date") || ""; // Agrega este campo

    const params = {
      origin,
      destination,
      start_date,
    };

    getTravels(params)
      .then((data) => {
        setTravels(data);
        setIsLoading(false);
      })
      .catch((error) => {
        setError(error);
        setIsLoading(false);
      });
  }, []);

  if (isLoading) return <Loader />;
  if (error) return toast.error("Error!");

  return (
    <div>
      <Navbar />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          margin: "16px",
        }}
      >
        <div className="text-title">Lista de Viajes</div>
        <div className="container-card">
          {travels.length === 0 ? (
            <NoTravelFound />
          ) : (
            travels.map((travel: Travel) => (
              <TravelCard key={travel.id} travel={travel} />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Travels;

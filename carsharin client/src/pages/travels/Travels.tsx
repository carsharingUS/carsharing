import React, { useEffect, useState } from "react";
import { getAllTravels } from "../../api/TravelService";
import { Travel } from "../../Interfaces";
import TravelCard from "../../components/travels/TravelCard";
import Navbar from "../../components/home/Navbar";

const Travels = () => {
  const [travels, setTravels] = useState<Travel[]>([]);

  useEffect(() => {
    const fetchTravels = async () => {
      try {
        const allTravels: Travel[] = await getAllTravels();
        setTravels(allTravels);
      } catch (error) {
        console.error("Error fetching travels:", error);
      }
    };

    fetchTravels();
  }, []);

  return (
    <div>
      <Navbar />
      <h1>Lista de Viajes</h1>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          margin: "16px",
        }}
      >
        <ul>
          {travels.map((travel: Travel) => (
            <TravelCard key={travel.id} travel={travel} />
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Travels;

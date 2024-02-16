import React, { useEffect, useState } from "react";
import { getAllTravels } from "../../api/TravelService";
import { Travel } from "../../Interfaces";
import TravelCard from "../../components/travels/TravelCard";
import Navbar from "../../components/home/Navbar";
import "../../components/travels/TravelCard.css";
import Loader from "../../components/Loader";
import toast from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";

const Travels = () => {
  const { data, isError, isLoading } = useQuery({
    queryKey: ["travels"],
    queryFn: getAllTravels,
  });

  if (isError) return toast.error("Error!");
  if (isLoading) return <Loader />;

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
          {data.map((travel: Travel) => (
            <TravelCard key={travel.id} travel={travel} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Travels;

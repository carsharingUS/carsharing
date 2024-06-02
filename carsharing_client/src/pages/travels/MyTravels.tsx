import React from "react";
import { getUserTravels } from "../../api/TravelService";
import { Travel } from "../../Interfaces";
import TravelCard from "../../components/travels/TravelCard";
import Navbar from "../../components/home/Navbar";
import "../../components/travels/TravelCard.css";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import Loader from "../../components/Loader";

const MyTravels = () => {
  const { data, isError, isLoading } = useQuery({
    queryKey: ["travels"],
    queryFn: getUserTravels,
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
        <div className="chats-header mt-4">Lista de Viajes</div>
        <div className="container-card">
        {data.length === 0 ? (
                <div className="flex min-h-full items-center justify-center">
                  <h2>No tienes nigún viaje publicado aún</h2>
                </div>
              ) : (
                data.map((travel: Travel) => (
                  <TravelCard key={travel.id} travel={travel} />
                ))
              )}
          
        </div>
      </div>
    </div>
  );
};

export default MyTravels;

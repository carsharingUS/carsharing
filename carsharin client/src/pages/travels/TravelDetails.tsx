import React from "react";
import { getTravel } from "../../api/TravelService";
import "../../components/travels/TravelCard.css";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import Loader from "../../components/Loader";
import { useParams } from "react-router-dom";

const TravelDetails = () => {
  const { travelId } = useParams();

  const { data, isError, isLoading } = useQuery({
    queryKey: ["travel", travelId],
    queryFn: () => getTravel(travelId || ""),
  });

  console.log(data);

  if (isError) return toast.error("Error!");
  if (isLoading) return <Loader />;

  return (
    <div>
      <h1>Detalles del viaje</h1>
      <p>Nombre: {data.id}</p>
      <p>Nombre: {data.destination}</p>
    </div>
  );
};

export default TravelDetails;

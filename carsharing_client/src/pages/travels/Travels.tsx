import React, { useState, useEffect, useContext } from "react";
import { getTravels } from "../../api/TravelService";
import { Travel } from "../../Interfaces";
import TravelCard from "../../components/travels/TravelCard";
import Navbar from "../../components/home/Navbar";
import "bootstrap/dist/css/bootstrap.min.css";
import Loader from "../../components/Loader";
import toast from "react-hot-toast";
import NoTravelFound from "../../components/travels/NoTravelFound";
import { useNavigate } from "react-router-dom";

const Travels = () => {
  const [travels, setTravels] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const searchParams = new URLSearchParams(location.search);

  const [closeTripsLoaded, setCloseTripsLoaded] = useState(false);

  
  // Al cargar la página, primero intenta recuperar los datos del almacenamiento local
  const storedCloseTrips = localStorage.getItem('closeTrips');

  useEffect(() => {
    const origin = searchParams.get("origin") || "";
    const destination = searchParams.get("destination") || "";
    const start_date = searchParams.get("start_date") || "";

    if (storedCloseTrips) {
      console.log(storedCloseTrips);

  
      let closeTripsData = [];
      if (storedCloseTrips && closeTripsLoaded === false) {
        closeTripsData = JSON.parse(storedCloseTrips);
        setTravels(closeTripsData);
        setIsLoading(false);
      } else {
        setError(error);
        setIsLoading(false);
      }
  
      setCloseTripsLoaded(true); // Marcar closeTrips como cargado
    }else{
      localStorage.setItem('closeTrips', '');
      setTravels([])
      setIsLoading(false)
      setCloseTripsLoaded(true)
    }
    /*
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

      */
  }, [storedCloseTrips, searchParams, error]);


  if (isLoading) return <Loader />;
  if (error) return toast.error("Error!");

  return (
    <div>
      <Navbar />
      <div className="container-fluid">
        <div className="row">
          <div className="chats-header mt-4">Lista de Viajes</div>
        </div>
        <div className="row justify-content-between">
          <div>
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
    </div>
  );
};

export default Travels;

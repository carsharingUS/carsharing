import React, { useState, useEffect, useContext } from "react";
import { getTravels } from "../../api/TravelService";
import { Travel } from "../../Interfaces";
import TravelCard from "../../components/travels/TravelCard";
import Navbar from "../../components/home/Navbar";
import "../../components/travels/TravelCard.css";
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
          <div className="col-md-8">
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
          <div className="col-md-3 mr-6 mt-3">
            <div className="card">
              <div className="card-header">Filtros</div>
              <div className="card-body">
                <form>
                  <div className="grid gap-4 mb-4 sm:grid-cols-2">
                    <div>
                      <label
                        htmlFor="origin"
                        className="block mb-2 text-sm font-medium text-gray-900 "
                      >
                        Origen
                      </label>
                      <input
                        type="text"
                        name="origin"
                        id="origin"
                        className="mb-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                        placeholder="Calle Ejemplo, Ciudad Ejemplo, Provincia Ejemplo"
                      />
                      <label
                        htmlFor="start_date"
                        className="block mb-2 text-sm font-medium text-gray-900 "
                      >
                        Fecha
                      </label>
                      <input
                        type="date"
                        id="start_date"
                        name="start_date"
                        className="bg-gray-50 border border-gray-300 text-gray-400 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:focus:ring-primary-500 dark:focus:border-primary-500"
                        style={{ maxWidth: "100%" }}
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="destination"
                        className="block mb-2 text-sm font-medium text-gray-900 "
                      >
                        Destino
                      </label>
                      <input
                        type="text"
                        name="destination"
                        id="destination"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                        placeholder="Calle Ejemplo, Ciudad Ejemplo, Provincia Ejemplo"
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="inline-flex items-center bg-gray-300 hover:bg-gray-400 focus:ring-4 focus:outline-none focus:ring-gray-500 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-700 ml-3"
                  >
                    Buscar
                  </button>
                  <button
                    type="button"
                    className="inline-flex items-center bg-gray-300 hover:bg-gray-400 focus:ring-4 focus:outline-none focus:ring-gray-500 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-700 ml-3"
                    onClick={() => {
                      navigate("/travels");
                    }}
                  >
                    Limpiar
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Travels;

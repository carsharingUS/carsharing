import React, { ChangeEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createTravel } from "../../api/TravelService";
import { toast } from "react-hot-toast";
import * as jwt_decode from "jwt-decode";
import dayjs from "dayjs";
import "dayjs/locale/es";
import { useAuthStore } from "../../store/auth";
import { Token } from "../../Interfaces";
import { get_solo_user } from "../../api/UserService";
dayjs.locale("es");

const TravelCreationPage = () => {
  const [origin, setOrigin] = useState<string>("");
  const [destination, setDestination] = useState<string>("");
  const [start_date, setStartDate] = useState<string>("");
  const [estimated_duration, setEstimatedDuration] = useState<string>("");
  const [price, setPrice] = useState<number>(0);
  const [stops, setStops] = useState<string>("");
  const [status, setStatus] = useState<string>("");

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const token: string = useAuthStore.getState().access;
  const tokenDecoded: Token = jwt_decode.jwtDecode(token);
  const id = tokenDecoded.user_id;

  const { data: user } = useQuery({
    queryKey: ["user", id],
    queryFn: () => get_solo_user(id),
  });
  console.log(user);

  const createTravelMutation = useMutation({
    mutationFn: createTravel,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["travels"] });
      toast.success("Travel created!");
      navigate("/");
    },
    onError: () => {
      toast.error("Error!");
      navigate("/");
    },
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    createTravelMutation.mutate({
      host: user,
      origin: origin,
      destination: destination,
      start_date: start_date,
      estimated_duration: estimated_duration,
      price: price,
      stops: stops,
    });
  };

  const handleOriginChange = (event: ChangeEvent<HTMLInputElement>) => {
    setOrigin(event.target.value);
  };

  const handleDestinationChange = (event: ChangeEvent<HTMLInputElement>) => {
    setDestination(event.target.value);
  };

  const handlePriceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newNumber = parseFloat(event.target.value);
    setPrice(isNaN(newNumber) ? 0 : newNumber);
  };

  const handleDateChange = (event: ChangeEvent<HTMLInputElement>) => {
    setStartDate(event.target.value);
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center">
      <div className="relative p-4 w-full max-w-2xl h-full md:h-auto">
        <div className="relative p-4 bg-white rounded-lg shadow dark:bg-gray-800 sm:p-5">
          <div className="flex justify-between items-center pb-4 mb-4 rounded-t border-b sm:mb-5 dark:border-gray-600">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Create Travel
            </h3>
            <Link
              to="/"
              className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
              data-modal-toggle="defaultModal"
            >
              <svg
                aria-hidden="true"
                className="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                ></path>
              </svg>
              <span className="sr-only">Close modal</span>
            </Link>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 mb-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="name"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Origen
                </label>
                <input
                  value={origin}
                  type="text"
                  onChange={handleOriginChange}
                  name="origin"
                  id="origin"
                  className="bg-gray-50 mb-4 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  placeholder="Calle Ejemplo, Ciudad Ejemplo, Provincia Ejemplo"
                />
                <label
                  htmlFor="name"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Destino
                </label>
                <input
                  value={destination}
                  type="text"
                  onChange={handleDestinationChange}
                  name="destination"
                  id="destination"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  placeholder="Calle Ejemplo, Ciudad Ejemplo, Provincia Ejemplo"
                />
              </div>
              <div>
                <label
                  htmlFor="price"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Precio
                </label>
                <input
                  value={price}
                  onChange={handlePriceChange}
                  type="number"
                  name="price"
                  step="0.01"
                  id="price"
                  className="mb-4 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  placeholder="1,50€"
                />
                <label
                  htmlFor="price"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Fecha
                </label>
                <input
                  type="datetime-local"
                  value={start_date}
                  onChange={handleDateChange}
                  className="search-input"
                ></input>
              </div>
            </div>
            <button
              type="submit"
              className="text-white inline-flex items-center bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
            >
              <svg
                className="mr-1 -ml-1 w-6 h-6"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                  clipRule="evenodd"
                ></path>
              </svg>
              Crear viaje
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TravelCreationPage;

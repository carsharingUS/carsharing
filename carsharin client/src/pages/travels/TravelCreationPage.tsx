import React, { ChangeEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createTravel } from "../../api/TravelService";
import { toast } from "react-hot-toast";
import dayjs from "dayjs";
import "dayjs/locale/es";
import { getCurrentUser } from "../../utils";
import "./TravelCreationPage.css";
import { OpenStreetMapProvider } from "leaflet-geosearch";
dayjs.locale("es");

const TravelCreationPage = () => {
  const [origin, setOrigin] = useState<string>("");
  const [originSuggestions, setOriginSuggestions] = useState<
    Array<{ label: string }>
  >([]);
  const [destination, setDestination] = useState<string>("");
  const [destinationSuggestions, setDestinationSuggestions] = useState<
    Array<{ label: string }>
  >([]);
  const [start_date, setStartDate] = useState<string>("");
  const [estimated_duration, setEstimatedDuration] = useState<string>("");
  const [price, setPrice] = useState<number>(0);
  const [stops, setStops] = useState<string>("");
  const [typingTimeout, setTypingTimeout] = useState<number>(0); // Nuevo estado para rastrear el tiempo de espera
  const [selectedSeats, setSelectedSeats] = useState<number>(0); // Estado para almacenar la cantidad de plazas seleccionadas

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: user } = getCurrentUser();

  const createTravelMutation = useMutation({
    mutationFn: createTravel,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["travels"] });
      toast.success("Travel created!");
      navigate("/");
    },
    onError: () => {
      toast.error("Error!");
      console.log(onerror);
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
      total_seats: selectedSeats,
    });
  };

  const handleOriginChange = (event: ChangeEvent<HTMLInputElement>) => {
    setOrigin(event.target.value);
    // Reiniciar el tiempo de espera
    clearTimeout(typingTimeout);
    // Establecer un nuevo tiempo de espera antes de realizar la búsqueda
    setTypingTimeout(
      setTimeout(
        () => searchAddresses(event.target.value, setOriginSuggestions),
        200
      )
    );
  };

  const handleDestinationChange = (event: ChangeEvent<HTMLInputElement>) => {
    setDestination(event.target.value);
    // Reiniciar el tiempo de espera
    clearTimeout(typingTimeout);
    // Establecer un nuevo tiempo de espera antes de realizar la búsqueda
    setTypingTimeout(
      setTimeout(
        () => searchAddresses(event.target.value, setDestinationSuggestions),
        200
      )
    );
  };

  const handlePriceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newNumber = parseFloat(event.target.value);
    setPrice(isNaN(newNumber) ? 0 : newNumber);
  };

  const handleDateChange = (event: ChangeEvent<HTMLInputElement>) => {
    setStartDate(event.target.value);
  };

  const handleSeatClick = (numSeats: number) => {
    setSelectedSeats((prevSelectedSeats) => {
      // Si el mismo asiento está seleccionado, deselecciona
      if (prevSelectedSeats === numSeats) {
        return 0;
      } else {
        // De lo contrario, selecciona el asiento
        return numSeats;
      }
    });
  };

  // Función para buscar sugerencias de direcciones
  const searchAddresses = async (query, setSuggestions) => {
    const provider = new OpenStreetMapProvider({
      params: {
        "accept-language": "es",
        countrycodes: "es",
      },
    });
    const results = await provider.search({ query });
    setSuggestions(results);
  };

  const handleOriginSuggestionClick = (suggestion) => {
    setOrigin(suggestion.label);
    setOriginSuggestions([]);
  };

  const handleDestinationSuggestionClick = (suggestion) => {
    setDestination(suggestion.label);
    setDestinationSuggestions([]);
  };

  return (
    <div className="crear-viaje-overlay">
      <div className="crear-viaje-modal">
        <div className="crear-viaje-header">
          <h3 className="crear-viaje-title">Create Travel</h3>
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
        <form className="search-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="origin" className="label">
              Origen
            </label>
            <input
              value={origin}
              type="text"
              onChange={handleOriginChange}
              name="origin"
              autoComplete="off"
              id="origin"
              className="input"
              placeholder="Calle Ejemplo, Ciudad Ejemplo, Provincia Ejemplo"
            />
            {originSuggestions.length > 0 && (
              <div className="suggestions-container">
                <div className="suggestions">
                  {originSuggestions.slice(0, 5).map((suggestion, index) => (
                    <div
                      key={index}
                      className="suggestion"
                      onClick={() => handleOriginSuggestionClick(suggestion)}
                    >
                      {suggestion?.label}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          <div className="input-group">
            <label htmlFor="destination" className="label">
              Destino
            </label>
            <input
              value={destination}
              type="text"
              onChange={handleDestinationChange}
              name="destination"
              autoComplete="off"
              id="destination"
              className="input"
              placeholder="Calle Ejemplo, Ciudad Ejemplo, Provincia Ejemplo"
            />
            {destinationSuggestions.length > 0 && (
              <div className="suggestions-container">
                <div className="suggestions">
                  {destinationSuggestions
                    .slice(0, 5)
                    .map((suggestion, index) => (
                      <div
                        key={index}
                        className="suggestion"
                        onClick={() =>
                          handleDestinationSuggestionClick(suggestion)
                        }
                      >
                        {suggestion?.label}
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
          <div className="input-group">
            <label htmlFor="price" className="label">
              Precio
            </label>
            <input
              value={price}
              onChange={handlePriceChange}
              type="number"
              name="price"
              step="0.01"
              id="price"
              className="input"
              placeholder="1,50€"
            />
          </div>
          <div className="input-group">
            <label htmlFor="start_date" className="label">
              Fecha
            </label>
            <input
              type="datetime-local"
              value={start_date}
              onChange={handleDateChange}
              className="input"
            />
          </div>
          <div className="input-group">
            <label htmlFor="seats" className="label">
              Número de plazas
            </label>
            &nbsp; &nbsp; &nbsp;
            <div className="seat-input-container">
              <div className="seat-icons-container">
                {[1, 2, 3, 4].map((numSeats) => (
                  <div
                    key={numSeats}
                    className={`seat-icon ${
                      numSeats <= selectedSeats ? "selected" : ""
                    }`}
                    onClick={() => handleSeatClick(numSeats)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      width="24"
                      height="24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="feather feather-user"
                    >
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                      <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <button type="submit" className="crear-viaje-button">
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
  );
};

export default TravelCreationPage;

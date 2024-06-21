import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createTravel, updateTravel, getTravel } from "../../api/TravelService";
import { toast } from "react-hot-toast";
import dayjs from "dayjs";
import "dayjs/locale/es";
import { getCurrentUser } from "../../utils";
import "./TravelCreationPage.css";
import { OpenStreetMapProvider } from "leaflet-geosearch";
import Navbar from "../../components/home/Navbar";
dayjs.locale("es");
import "animate.css";
import { Travel } from "../../Interfaces";

const calculateAge = (birthDate: string) => {
  console.log(birthDate);
  if (!birthDate) {
    console.error("Invalid birth date");
    return NaN;
  }
  const today = new Date();
  const birthDateObj = new Date(birthDate);

  if (isNaN(birthDateObj.getTime())) {
    console.error("Invalid birth date format");
    return NaN;
  }

  let age = today.getFullYear() - birthDateObj.getFullYear();
  const monthDiff = today.getMonth() - birthDateObj.getMonth();
  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDateObj.getDate())
  ) {
    age--;
  }

  console.log(age);
  return age;
};

const TravelCreationPage = ({ mode }) => {
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
  const { travelId } = useParams();
  const [typingTimeout, setTypingTimeout] = useState<ReturnType<
    typeof setTimeout
  > | null>(null);
  const [selectedSeats, setSelectedSeats] = useState<number>(0);
  const modalRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: user } = getCurrentUser();

  useEffect(() => {
    if (travelId) {
      const fetchTravelDetails = async () => {
        try {
          const travel = await getTravel(travelId);
          setOrigin(travel.origin);
          setDestination(travel.destination);
          const formattedDate = dayjs(travel.start_date).format(
            "YYYY-MM-DDTHH:mm"
          );
          setStartDate(formattedDate);
          setEstimatedDuration(travel.estimated_duration);
          setPrice(travel.price);
          setStops(travel.stops);
          setSelectedSeats(travel.total_seats);
        } catch (error) {
          toast.error("Error fetching travel details!");
        }
      };
      fetchTravelDetails();
    }
  }, [mode, travelId]);

  const createTravelMutation = useMutation({
    mutationFn: createTravel,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["travels"] });
      toast.success("Viaje creado");
      navigate("/");
    },
    onError: () => {
      toast.error("Error al crear el viaje");
      console.log(onerror);
      navigate("/");
    },
  });

  const updateTravelMutation = useMutation({
    mutationFn: updateTravel,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["travels"] });
      toast.success("Travel updated!");
      navigate("/");
    },
    onError: () => {
      toast.error("Error updating travel!");
    },
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log(user);
    if (user) {
      const age = calculateAge(user.birthDate);
      if (age < 18 || isNaN(age)) {
        toast.error("Debes tener al menos 18 años para crear un viaje.");
        return;
      }
    }

    const today = new Date();
    const selectedStartDate = new Date(start_date);
    if (selectedStartDate.getTime() < today.getTime()) {
      toast.error(
        "La fecha de inicio del viaje no puede ser anterior a la fecha actual."
      );
      return;
    }

    const travelData: Partial<Travel> = {
      host: user,
      origin,
      destination,
      start_date,
      estimated_duration,
      price,
      stops,
      total_seats: selectedSeats,
    };

    if (mode === "create") {
      createTravelMutation.mutate(travelData);
    } else if (travelId) {
      updateTravelMutation.mutate({ id: Number(travelId), ...travelData });
    }
  };

  const handleOriginChange = (event: ChangeEvent<HTMLInputElement>) => {
    setOrigin(event.target.value);
    // Reiniciar el tiempo de espera
    if (typingTimeout !== null) {
      clearTimeout(typingTimeout);
    }
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
    if (typingTimeout !== null) {
      clearTimeout(typingTimeout);
    }
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
    console.log(event.target.value);
  };

  const handleSeatClick = (numSeats: number) => {
    setSelectedSeats((prevSelectedSeats) => {
      if (prevSelectedSeats === numSeats) {
        return 0;
      } else {
        return numSeats;
      }
    });
  };

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

  useEffect(() => {
    if (modalRef.current) {
      modalRef.current.focus();
      modalRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, []);

  return (
    <div>
      <Navbar />
      <div className="crear-viaje-overlay">
        <div tabIndex={-1} ref={modalRef} className="crear-viaje-modal">
          <div className="crear-viaje-header">
            <h3 className="crear-viaje-title">
              {mode === "create" ? "Create Travel" : "Edit Travel"}
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
              {mode === "create" ? "Crear viaje" : "Guardar cambios"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TravelCreationPage;

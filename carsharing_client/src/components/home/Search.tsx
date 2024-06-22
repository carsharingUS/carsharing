import React, { useState, useEffect, useContext } from "react";
import { motion } from "framer-motion";
import "./SearchComponent.css";
import { useNavigate } from "react-router-dom";
import { OpenStreetMapProvider } from "leaflet-geosearch";
import {
  getCoordinates,
  getDistanceSearchUser,
  getRoute,
} from "../../api/TravelService";
import toast from "react-hot-toast";
import Loader from "../Loader";
import { useAuthStore } from "../../store/auth";
import { Token } from "../../Interfaces";
import { useQuery } from "@tanstack/react-query";
import { get_solo_user } from "../../api/UserService";
import * as jwt_decode from "jwt-decode";

const SearchComponent = () => {
  const [origin, setOrigin] = useState("");
  const [originSuggestions, setOriginSuggestions] = useState<
    Array<{ label: string }>
  >([]);
  const [destination, setDestination] = useState("");
  const [destinationSuggestions, setDestinationSuggestions] = useState<
    Array<{ label: string }>
  >([]);
  const [start_date, setStartDate] = useState("");
  const [typingTimeout, setTypingTimeout] = useState<ReturnType<
    typeof setTimeout
  > | null>(null);
  const navigate = useNavigate();
  const [isLoadingSearch, setLoadingSearch] = useState(false);
  const isAuthenticated = useAuthStore((state) => state.isAuth);

  const handleSearch = () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    if (!origin || !destination) {
      toast.error("Por favor, ingrese el origen y destino");
      return;
    }

    if (!Date.parse(start_date)) {
      toast.error("Por favor, ingrese una fecha válida");
      return;
    }

    setLoadingSearch(true);
    const searchTimeout = setTimeout(() => {
      toast.error(
        "La búsqueda está tardando demasiado, por favor intente nuevamente"
      );
      setLoadingSearch(false);
    }, 10000); // 10 segundos de timeout

    getDistanceSearchUser(origin, destination, start_date)
      .then((closeTravels) => {
        clearTimeout(searchTimeout); // Limpiar el timeout si la respuesta llega a tiempo
        if (closeTravels) {
          localStorage.setItem("closeTrips", JSON.stringify(closeTravels));
          const queryParams = new URLSearchParams({
            origin,
            destination,
            start_date,
          });
          navigate(`/travels?${queryParams.toString()}`);
          toast.success("Busqueda realizada");
        } else {
          toast.error("Error al buscar el viaje");
        }
      })
      .catch((error) => {
        clearTimeout(searchTimeout); // Limpiar el timeout si hay un error
        toast.error("Error al buscar el viaje");
      })
      .finally(() => {
        setLoadingSearch(false);
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

  // Función para manejar la selección de una sugerencia
  const handleSuggestionClick = (suggestion, setField, setSuggestions) => {
    setField(suggestion.label);
    setSuggestions([]);
  };

  // Función para manejar el cambio en el campo de búsqueda
  const handleInputChange = (value, setField, setSuggestions) => {
    setField(value);
    // Reiniciar el tiempo de espera
    if (typingTimeout !== null) {
      clearTimeout(typingTimeout);
    }
    // Establecer un nuevo tiempo de espera antes de realizar la búsqueda
    setTypingTimeout(
      setTimeout(() => searchAddresses(value, setSuggestions), 200)
    );
  };

  // Limpiar las sugerencias cuando el campo de búsqueda está vacío
  useEffect(() => {
    if (origin === "") setOriginSuggestions([]);
    if (destination === "") setDestinationSuggestions([]);
  }, [origin, destination]);

  return (
    <div className="search-section">
      {isLoadingSearch && <Loader />}
      <div className="background-video">
        <video autoPlay loop muted className="background-video-content">
          <source
            src="http://localhost:8000/media/HomeCar4.mp4"
            type="video/mp4"
          />
          Tu navegador no soporta el elemento de video.
        </video>
      </div>
      <div className="search-section-container">
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          className="search-container"
        >
          <h2 className="search-title">Encuentra tu próximo viaje</h2>
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="search-form"
          >
            <motion.label
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="search-label"
            >
              Desde:
            </motion.label>
            <div className="search-input-container">
              <input
                id = "Origen"
                type="text"
                placeholder="Origen"
                autoComplete="off"
                value={origin}
                onChange={(e) =>
                  handleInputChange(
                    e.target.value,
                    setOrigin,
                    setOriginSuggestions
                  )
                }
                className="search-input"
              />
              {originSuggestions.length > 0 && (
                <div className={`suggestions-home`}>
                  {originSuggestions.slice(0, 5).map((suggestion, index) => (
                    <div
                      key={index}
                      className="suggestion-home"
                      onClick={() =>
                        handleSuggestionClick(
                          suggestion,
                          setOrigin,
                          setOriginSuggestions
                        )
                      }
                    >
                      {suggestion?.label}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <motion.label
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="search-label"
            >
              Hasta:
            </motion.label>
            <div className="search-input-container">
              <input
                id = "Destino"
                type="text"
                placeholder="Destino"
                autoComplete="off"
                value={destination}
                onChange={(e) =>
                  handleInputChange(
                    e.target.value,
                    setDestination,
                    setDestinationSuggestions
                  )
                }
                className="search-input"
              />
              {destinationSuggestions.length > 0 && (
                <div className={`suggestions-home`}>
                  {destinationSuggestions
                    .slice(0, 5)
                    .map((suggestion, index) => (
                      <div
                        key={index}
                        className="suggestion-home"
                        onClick={() =>
                          handleSuggestionClick(
                            suggestion,
                            setDestination,
                            setDestinationSuggestions
                          )
                        }
                      >
                        {suggestion?.label}
                      </div>
                    ))}
                </div>
              )}
            </div>
            <motion.label
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 1.0 }}
              className="search-label"
            >
              Fecha del Viaje:
            </motion.label>
            <input
              id = "dateSearch"
              type="date"
              value={start_date}
              onChange={(e) => setStartDate(e.target.value)}
              className="search-input"
            />
            <motion.button
              onClick={handleSearch}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="search-button"
            >
              Buscar
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default SearchComponent;

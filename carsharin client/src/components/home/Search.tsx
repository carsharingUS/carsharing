import React, { useState, useEffect, useContext  } from "react";
import { motion } from "framer-motion";
import "./SearchComponent.css";
import { useNavigate } from "react-router-dom";
import { OpenStreetMapProvider } from 'leaflet-geosearch';
import { getCoordinates, getDistanceSearchUser, getRoute } from "../../api/TravelService";

const SearchComponent = () => {
  const [origin, setOrigin] = useState("");
  const [originSuggestions, setOriginSuggestions] = useState<Array<{ label: string }>>([]);
  const [destination, setDestination] = useState("");
  const [destinationSuggestions, setDestinationSuggestions] = useState<Array<{ label: string }>>([]);
  const [start_date, setStartDate] = useState("");
  const [typingTimeout, setTypingTimeout] = useState(0); // Nuevo estado para rastrear el tiempo de espera
  const navigate = useNavigate();


  const handleSearch = async () => {
    

    if (origin != null && destination != null){

      const closeTravels = await getDistanceSearchUser(origin, destination, start_date);

      if (closeTravels) {
        localStorage.setItem('closeTrips', JSON.stringify(closeTravels));
      }

    //una vez que tengo la distancia de la ruta que ha introducido el usuario le paso a la nueva pagina la distancia y que procese los viajes mas cercanos primero
    const queryParams = new URLSearchParams({
      origin,
      destination,
      start_date,
    });

    navigate(`/travels?${queryParams.toString()}`);
    
    }
  };

  // Función para buscar sugerencias de direcciones
  const searchAddresses = async (query, setSuggestions) => {
    const provider = new OpenStreetMapProvider({
      params: {
        'accept-language': 'es',
        countrycodes: 'es',
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
    clearTimeout(typingTimeout);
    // Establecer un nuevo tiempo de espera antes de realizar la búsqueda
    setTypingTimeout(setTimeout(() => searchAddresses(value, setSuggestions), 200));
  };

  // Limpiar las sugerencias cuando el campo de búsqueda está vacío
  useEffect(() => {
    
    if (origin === "") setOriginSuggestions([]);
    if (destination === "") setDestinationSuggestions([]);
  }, [origin, destination]);
  return (
    <div className="search-section">
      <div className="background-video">
        <video autoPlay loop muted className="background-video-content">
          <source
            src="http://localhost:8000/media/HomeCar4.mp4"
            type="video/mp4"
          />
          Tu navegador no soporta el elemento de video.
        </video>
      </div>
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
              type="text"
              placeholder="Origen"
              autoComplete="off"
              value={origin}
              onChange={(e) => handleInputChange(e.target.value, setOrigin, setOriginSuggestions)}
              className="search-input"
            />
            {originSuggestions.length > 0 && (
              <div className={`suggestions-home`}>
                {originSuggestions.slice(0, 5).map((suggestion, index) => (
                  <div
                    key={index}
                    className="suggestion-home"
                    onClick={() =>
                      handleSuggestionClick(suggestion, setOrigin, setOriginSuggestions)
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
              type="text"
              placeholder="Destino"
              autoComplete="off"
              value={destination}
              onChange={(e) => handleInputChange(e.target.value, setDestination, setDestinationSuggestions)}
              className="search-input"
            />
            {destinationSuggestions.length > 0 && (
              <div className={`suggestions-home`}>
                {destinationSuggestions.slice(0, 5).map((suggestion, index) => (
                  <div
                    key={index}
                    className="suggestion-home"
                    onClick={() =>
                      handleSuggestionClick(suggestion, setDestination, setDestinationSuggestions)
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
  );
};

export default SearchComponent;

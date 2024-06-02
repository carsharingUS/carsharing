import React, { useState, useEffect } from "react";
import { getDistanceSearchUser, getTravels } from "../../api/TravelService";
import { Travel } from "../../Interfaces";
import TravelCard from "../../components/travels/TravelCard";
import Navbar from "../../components/home/Navbar";
import "../../components/travels/TravelCard.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Loader from "../../components/Loader";
import toast from "react-hot-toast";
import NoTravelFound from "../../components/travels/NoTravelFound";
import { useNavigate } from "react-router-dom";
import { FaCog } from 'react-icons/fa';
import { OpenStreetMapProvider } from "leaflet-geosearch";
import "./Travels.css";

const Travels = () => {
  const [travels, setTravels] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const searchParams = new URLSearchParams(window.location.search);
  const [showIcon, setShowIcon] = useState(true);

  const [origin, setOrigin] = useState("");
  const [originSuggestions, setOriginSuggestions] = useState<Array<{ label: string }>>([]);
  const [destination, setDestination] = useState("");
  const [destinationSuggestions, setDestinationSuggestions] = useState<Array<{ label: string }>>([]);
  const [start_date, setStartDate] = useState("");
  const [typingTimeout, setTypingTimeout] = useState(0);
  const [isFocused, setIsFocused] = useState(false);

  const handleSearch = async () => {
    setIsLoading(true);

    try {
      if (origin !== "" && destination !== "") {
        const closeTravels = await getDistanceSearchUser(origin, destination, start_date);
        if (closeTravels) {
          localStorage.setItem('closeTrips', JSON.stringify(closeTravels));
        }

        const queryParams = new URLSearchParams({ origin, destination, start_date });
        navigate(`/travels?${queryParams.toString()}`);
        window.location.reload();
      }
    } catch (error) {
      toast.error("Error al buscar el viaje");
      setError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearFilters = () => {
    setOrigin("");
    setDestination("");
    setStartDate("");
  };

  const searchAddresses = async (query, setSuggestions) => {
    const provider = new OpenStreetMapProvider({
      params: { 'accept-language': 'es', countrycodes: 'es' },
    });
    const results = await provider.search({ query });
    setSuggestions(results);
  };

  const handleSuggestionClick = (suggestion, setField, setSuggestions) => {
    setField(suggestion.label);
    setSuggestions([]);
  };

  const handleInputChange = (value, setField, setSuggestions) => {
    setField(value);
    clearTimeout(typingTimeout);
    setTypingTimeout(setTimeout(() => searchAddresses(value, setSuggestions), 200));
  };

  useEffect(() => {
    {isLoading && <Loader />}
    if (origin === "") setOriginSuggestions([]);
    if (destination === "") setDestinationSuggestions([]);
  }, [origin, destination]);

  const [closeTripsLoaded, setCloseTripsLoaded] = useState(false);
  const storedCloseTrips = localStorage.getItem("closeTrips");

  useEffect(() => {
    if (storedCloseTrips) {
      let closeTripsData = [];
      if (storedCloseTrips && !closeTripsLoaded) {
        closeTripsData = JSON.parse(storedCloseTrips);
        setTravels(closeTripsData);
        setIsLoading(false);
      } else {
        setError(error);
        setIsLoading(false);
      }
      setCloseTripsLoaded(true);
    } else {
      localStorage.setItem("closeTrips", "");
      setTravels([]);
      setIsLoading(false);
      setCloseTripsLoaded(true);
    }
  }, [storedCloseTrips, searchParams, error]);
  

  const handleSort = (sortKey) => {
    const sortedTravels = [...travels].sort((a, b) => {
      if (sortKey === 'price' || sortKey === 'total_seats') {
        return a[sortKey] - b[sortKey];
      } else if (sortKey === 'start_date') {
        return new Date(a[sortKey]).getTime() - new Date(b[sortKey]).getTime();
      }
      return 0;
    });
    setTravels(sortedTravels);
  };

  if (isLoading) return <Loader />;
  if (error) return toast.error("Error!");

  return (
    <div>
      <Navbar />
      <div className="container">
        <div className="row">
          <div className="col-md-8">
            <div className={`filter-wheel ${isFocused ? 'focused' : ''}`}
              onMouseEnter={() => setShowIcon(false)}
              onMouseLeave={() => {
                if (!isFocused) {
                  setShowIcon(true);
                }
              }}>
              {showIcon && (
                <div className="icon-container">
                  <FaCog />
                </div>
              )}
              <div className="filter-content" >
                <form>
                  <div className="form-group">
                    <input
                      type="text"
                      placeholder="Origen"
                      autoComplete="off"
                      value={origin}
                      onChange={(e) => handleInputChange(e.target.value, setOrigin, setOriginSuggestions)}
                    />
                    {originSuggestions.length > 0 && (
                      <div className={`suggestions-home`}>
                        {originSuggestions.slice(0, 5).map((suggestion, index) => (
                          <div
                            key={index}
                            className="suggestion-home"
                            onClick={() => handleSuggestionClick(suggestion, setOrigin, setOriginSuggestions)}
                          >
                            {suggestion?.label}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="form-group">
                    <input
                      type="text"
                      placeholder="Destino"
                      autoComplete="off"
                      value={destination}
                      onChange={(e) => handleInputChange(e.target.value, setDestination, setDestinationSuggestions)}
                    />
                    {destinationSuggestions.length > 0 && (
                      <div className={`suggestions-home`}>
                        {destinationSuggestions.slice(0, 5).map((suggestion, index) => (
                          <div
                            key={index}
                            className="suggestion-home"
                            onClick={() => handleSuggestionClick(suggestion, setDestination, setDestinationSuggestions)}
                          >
                            {suggestion?.label}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="form-group">
                    <input
                      type="date"
                      id="start_date"
                      name="start_date"
                      value={start_date}
                      onFocus={() => {
                        setShowIcon(false);
                        setIsFocused(true);
                      }}
                      onBlur={() => {
                        setShowIcon(true);
                        setIsFocused(false);
                      }}
                      onChange={(event) => setStartDate(event.target.value)}
                    />
                  </div>
                  <button type="button" onClick={handleSearch}>Buscar</button>
                  <button type="button" onClick={handleClearFilters}>Limpiar</button>
                </form>
                <div className="sort-options">
                  <button onClick={() => handleSort('price')}>Ordenar por precio</button>
                  <button onClick={() => handleSort('start_date')}>Ordenar por fecha</button>
                  <button onClick={() => handleSort('total_seats')}>Ordenar por asientos</button>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-9">
            <div className="chats-header mt-4">Lista de Viajes</div>
            <div style={{ marginLeft: '2rem' }}>
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
    </div>
  );
};

export default Travels;

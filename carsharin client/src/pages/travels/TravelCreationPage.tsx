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
import Navbar from "../../components/home/Navbar";
import {
  TextField,
  Button,
  IconButton,
  InputAdornment,
  Container,
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  SvgIcon,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import PersonIcon from "@mui/icons-material/Person";

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
  const [typingTimeout, setTypingTimeout] = useState<number>(0);
  const [selectedSeats, setSelectedSeats] = useState<number>(0);

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
    clearTimeout(typingTimeout);
    setTypingTimeout(
      setTimeout(
        () => searchAddresses(event.target.value, setOriginSuggestions),
        200
      )
    );
  };

  const handleDestinationChange = (event: ChangeEvent<HTMLInputElement>) => {
    setDestination(event.target.value);
    clearTimeout(typingTimeout);
    setTypingTimeout(
      setTimeout(
        () => searchAddresses(event.target.value, setDestinationSuggestions),
        200
      )
    );
  };

  const handlePriceChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newNumber = parseFloat(event.target.value);
    setPrice(isNaN(newNumber) ? 0 : newNumber);
  };

  const handleDateChange = (event: ChangeEvent<HTMLInputElement>) => {
    setStartDate(event.target.value);
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

  return (
    <>
      <Navbar />

      <Container>
        <Box className="crear-viaje-modal">
          <Box className="crear-viaje-header">
            <Typography variant="h3" className="crear-viaje-title">
              Crear viaje
            </Typography>
            <IconButton
              component={Link}
              to="/"
              aria-label="close"
              className="close-modal"
            >
              <CloseIcon />
            </IconButton>
          </Box>
          <form className="search-form" onSubmit={handleSubmit}>
            <TextField
              label="Origen"
              value={origin}
              onChange={handleOriginChange}
              name="origin"
              autoComplete="off"
              fullWidth
              margin="normal"
              variant="outlined"
              placeholder="Calle Ejemplo, Ciudad Ejemplo, Provincia Ejemplo"
            />
            {originSuggestions.length > 0 && (
              <List className="suggestions-container">
                {originSuggestions.slice(0, 5).map((suggestion, index) => (
                  <ListItem
                    button
                    key={index}
                    onClick={() => handleOriginSuggestionClick(suggestion)}
                  >
                    <ListItemText primary={suggestion.label} />
                  </ListItem>
                ))}
              </List>
            )}
            <TextField
              label="Destino"
              value={destination}
              onChange={handleDestinationChange}
              name="destination"
              autoComplete="off"
              fullWidth
              margin="normal"
              variant="outlined"
              placeholder="Calle Ejemplo, Ciudad Ejemplo, Provincia Ejemplo"
            />
            {destinationSuggestions.length > 0 && (
              <List className="suggestions-container">
                {destinationSuggestions.slice(0, 5).map((suggestion, index) => (
                  <ListItem
                    button
                    key={index}
                    onClick={() => handleDestinationSuggestionClick(suggestion)}
                  >
                    <ListItemText primary={suggestion.label} />
                  </ListItem>
                ))}
              </List>
            )}
            <TextField
              label="Precio"
              value={price}
              onChange={handlePriceChange}
              type="number"
              name="price"
              fullWidth
              margin="normal"
              variant="outlined"
              placeholder="1,50€"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">€</InputAdornment>
                ),
              }}
            />
            <TextField
              label="Fecha"
              type="datetime-local"
              value={start_date}
              onChange={handleDateChange}
              fullWidth
              margin="normal"
              variant="outlined"
              InputLabelProps={{
                shrink: true,
              }}
            />
            <Box className="input-group">
              <Typography className="label" style={{ marginRight: "1rem" }}>
                Número de plazas
              </Typography>
              <Box className="seat-icons-container">
                {[1, 2, 3, 4].map((numSeats) => (
                  <Box
                    key={numSeats}
                    className={`seat-icon ${
                      numSeats <= selectedSeats ? "selected" : ""
                    }`}
                    onClick={() => handleSeatClick(numSeats)}
                  >
                    <SvgIcon component={PersonIcon} />
                  </Box>
                ))}
              </Box>
            </Box>
            <Button
              type="submit"
              color="primary"
              variant="contained"
              startIcon={<AddIcon />}
              className="crear-viaje-button"
            >
              Crear viaje
            </Button>
          </form>
        </Box>
      </Container>
    </>
  );
};

export default TravelCreationPage;

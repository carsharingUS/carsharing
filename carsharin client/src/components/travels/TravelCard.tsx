import React, { FC } from "react";
import { Travel } from "../../Interfaces";
import Typography from "@mui/material/Typography";
import dayjs from "dayjs";
import "dayjs/locale/es";
import utc from "dayjs/plugin/utc";
import { CardActionArea } from "@mui/material";
import LinearProgress from "@mui/material/LinearProgress"; // Importa el componente de progreso lineal
dayjs.locale("es");
dayjs.extend(utc);

interface Props {
  travel: Travel;
}

const TravelCard: FC<Props> = ({ travel }) => {
  const avatarUrl = "travel.host?.avatar";

  // Calcula el porcentaje de ocupación de plazas
  const occupancyPercentage = ((travel.total_seats) / 4) * 100;

  return (
    <div className="travels-container">
      <CardActionArea href={`/travels/${travel.id}`}>
        <div className="travel">
          <div className="travel-preview">
            <div className="rounded-image">
              <img
                src={avatarUrl}
                alt="Foto de perfil"
                style={{
                  width: "80px",
                  height: "80px",
                  borderRadius: "50%",
                  margin: "auto",
                  display: "block",
                }}
              />
            </div>
            <div
              className="travel-host"
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "flex-end",
                height: "40%",
              }}
            >
              <div className="fas fa-chevron-right"></div>
              {travel.host?.username}
            </div>
          </div>
          <div className="travel-info">
            <div className="progress-container">
              <LinearProgress variant="determinate" value={occupancyPercentage} 
              sx={{
                height: 10, // Grosor de la barra
                borderRadius: 10, // Redondez de las esquinas
                "& .MuiLinearProgress-bar": {
                  backgroundColor: "#2a265f", // Color de la barra
                  borderRadius: 10, // Redondez de la barra
                },
              }}/>
              <span className="progress-text">{travel.total_seats} Plazas libres</span>
            </div>
            <br />
            <h6>{travel.destination}</h6>
            <h2>Salida: {travel.origin}</h2>
            <h2>Duración estimada: {travel.estimated_duration}</h2>
            <h2>Precio: {travel.price} €</h2>
            <h2>
              Fecha: {dayjs(travel.start_date).format("DD/MM/YYYY HH:mm")}
            </h2>
            <div className="progress-text">
              <Typography sx={{ textTransform: "capitalize" }}>
                {travel.status}
              </Typography>
            </div>
          </div>
        </div>
      </CardActionArea>
    </div>
  );
};

export default TravelCard;

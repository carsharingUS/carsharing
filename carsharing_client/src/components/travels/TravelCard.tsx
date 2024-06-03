import React, { FC } from "react";
import { Travel } from "../../Interfaces";
import Typography from "@mui/material/Typography";
import dayjs from "dayjs";
import "dayjs/locale/es";
import utc from "dayjs/plugin/utc";
import { CardActionArea } from "@mui/material";
import LinearProgress from "@mui/material/LinearProgress";
import "./TravelCard.css"; // Estilos CSS personalizados
dayjs.locale("es");
dayjs.extend(utc);

interface Props {
  travel: Travel;
  status?: string; // Prop opcional para el estado del viaje
}


const TravelCard: FC<Props> = ({ travel, status  }) => {
  const avatarUrl = `http://localhost:8000${travel.host?.avatar}`;
  const occupancyPercentage =  ((travel.total_seats) / 4) * 100;

  // Determinar el color de fondo según el estado del viaje
  const getStatusBackgroundColor = () => {
    switch (status) {
      case "en_curso":
        return "#f6f4a0"; // Amarillo para viajes en curso
      case "completado":
        return "#c6f8c6"; // Verde claro para viajes completados
      default:
        return "#ffffff"; // Blanco por defecto
    }
  };

  return (
    <div className="travel-card">
      <CardActionArea href={`/travels/${travel.id}`}>
        <div className="travel" style={{ backgroundColor: getStatusBackgroundColor() }}>
          {travel.mejor_opcion && (
            <div className="best-option-indicator">★</div>
          )}
          <div className="travel-preview">
            <div className="rounded-image">
              <img
                src={avatarUrl}
                alt="Foto de perfil"
                className="avatar-image"
              />
            </div>
            <div className="travel-host">
              <i className="fas fa-chevron-right"></i>
              {travel.host?.username}
            </div>
          </div>
          <div className="travel-info">
            <div className="progress-container">
              <LinearProgress
                variant="determinate"
                value={occupancyPercentage}
                sx={{
                  height: 10,
                  borderRadius: 10,
                  "& .MuiLinearProgress-bar": {
                    backgroundColor: "#2a265f",
                    borderRadius: 10,
                  },
                }}
              />
              <span className="progress-text">{travel.total_seats} Plazas libres</span>
            </div>
            <br />
            <div className="destination-info">
              <h6>{travel.destination}</h6>
              {travel.clasificacion_destino && (
                <div className={`classification-indicator ${travel.clasificacion_destino}`}>
                  {travel.clasificacion_destino}
                </div>
              )}
            </div>
            <div className="origin-info">
              <h6>Salida: {travel.origin}</h6>
              {travel.clasificacion_origen && (
                <div className={`classification-indicator ${travel.clasificacion_origen}`}>
                  {travel.clasificacion_origen}
                </div>
              )}
            </div>
            <Typography variant="body2">Duración estimada: {travel.estimated_duration}</Typography>
            <Typography variant="body2">Precio: {travel.price} €</Typography>
            <Typography variant="body2">Fecha: {dayjs(travel.start_date).format("DD/MM/YYYY HH:mm")}</Typography>
            <Typography variant="body2" className="progress-text" sx={{ textTransform: "capitalize" }}>
              {travel.status}
            </Typography>
          </div>
        </div>
      </CardActionArea>
    </div>
  );
};

export default TravelCard;

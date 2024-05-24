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
}

const TravelCard: FC<Props> = ({ travel }) => {
  const avatarUrl = "travel.host?.avatar";
  const occupancyPercentage = ((travel.total_seats) / 4) * 100;


  return (
    <div className="travel-card">
      <CardActionArea href={`/travels/${travel.id}`}>
        <div className="travel">
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
              <div className="fas fa-chevron-right"></div>
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
            &nbsp;
            {travel.clasificacion_destino && (
              <div className={`classification-indicator ${travel.clasificacion_destino}`}>
                {travel.clasificacion_destino}
              </div>
            )}
            </div>
            <div className="origin-info">
            <h2>Salida: {travel.origin}</h2>
            &nbsp;
            {travel.clasificacion_origen && (
              <div className={`classification-indicator ${travel.clasificacion_origen}`}>
                {travel.clasificacion_origen}
              </div>
            )}
            </div>
            <h2>Duración estimada: {travel.estimated_duration}</h2>
            <h2>Precio: {travel.price} €</h2>
            <h2>Fecha: {dayjs(travel.start_date).format("DD/MM/YYYY HH:mm")}</h2>
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

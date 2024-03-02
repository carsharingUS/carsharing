import React, { FC } from "react";
import { Travel } from "../../Interfaces";
import Typography from "@mui/material/Typography";
import dayjs from "dayjs";
import "dayjs/locale/es";
import utc from "dayjs/plugin/utc";
import { CardActionArea } from "@mui/material";
dayjs.locale("es");
dayjs.extend(utc);

interface Props {
  travel: Travel;
}

const TravelCard: FC<Props> = ({ travel }) => {
  const avatarUrl = "travel.host?.avatar";

  // const handleDeleteTravel = async (id: number) => {
  //   try {
  //     await deleteTravel(id);
  //   } catch (error) {
  //     console.error("Error al eliminar el viaje:", error);
  //   }
  // };

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
              <div className="progress"></div>
              <span className="progress-text">6/9 Plazas libres</span>
            </div>
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

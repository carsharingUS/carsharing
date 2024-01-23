import React, { FC, useEffect, useState } from "react";
import { Travel, User } from "../../Interfaces";
import Typography from "@mui/material/Typography";
import { getUser } from "../../api/UserService";
import { baseURL } from "../../constants";
import "./TravelCard.css";
import dayjs from "dayjs";
import "dayjs/locale/es";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
dayjs.locale("es");
dayjs.extend(utc);

interface Props {
  travel: Travel;
}

const TravelCard: FC<Props> = ({ travel }) => {
  const [host, setHost] = useState<User>();
  const avatarUrl = `${baseURL}${host?.avatar}`;
  const locatedDate = dayjs(travel.start_date)
    .utc() // Convierte a UTC
    .format("DD/MM/YYYY HH:mm");

  useEffect(() => {
    const fetchHost = async () => {
      try {
        const hostData = await getUser(travel.host);
        setHost(hostData);
      } catch (error) {
        console.error("Error al obtener información del host:", error);
      }
    };

    fetchHost();
  }, [travel.host]);

  return (
    <div className="courses-container">
      <div className="course">
        <div className="course-preview">
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
          <a
            href="#"
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "flex-end",
              height: "40%",
            }}
          >
            <i className="fas fa-chevron-right"></i> {host?.username}
          </a>
        </div>
        <div className="course-info">
          <div className="progress-container">
            <div className="progress"></div>
            <span className="progress-text">6/9 Plazas libres</span>
          </div>
          <h6>{travel.destination}</h6>
          <h2>Salida: {travel.origin}</h2>
          <h2>Duración estimada: {travel.estimated_duration}</h2>
          <h2>Precio: {travel.price}</h2>
          <h2>Fecha: {dayjs(travel.start_date).format("DD/MM/YYYY HH:mm")}</h2>
          <div className="progress-text">
            <Typography sx={{ textTransform: "capitalize" }}>
              {travel.status}
            </Typography>
          </div>
          <button className="btn">Solicitar plaza</button>
        </div>
      </div>
    </div>
  );
};

export default TravelCard;

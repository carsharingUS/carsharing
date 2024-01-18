import React, { FC, useEffect, useState } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { Button, CardActionArea, CardActions } from "@mui/material";
import { Travel, User } from "../../Interfaces";
import { getUser } from "../../api/UserService";
import { baseURL } from "../../constants";
import "./TravelCard.css";
interface Props {
  travel: Travel;
}

const TravelCard: FC<Props> = ({ travel }) => {
  const [host, setHost] = useState<User>();
  const avatarUrl = `${baseURL}${host?.avatar}`;

  useEffect(() => {
    const fetchHost = async () => {
      try {
        const hostData = await getUser(travel.host);
        console.log("correcto");
        setHost(hostData);
      } catch (error) {
        console.error("Error al obtener información del host:", error);
      }
    };

    fetchHost();
  }, [travel.host]);

  return (
    <div className="couses-container">
      <div className="course">
        <div className="course-preview">
          <h6>Course</h6>
          <h2>JavaScript Fundamentals</h2>
          <a href="#">
            View all chapters <i className="fas fa-chevron-right"></i>
          </a>
        </div>
        <div className="course-info">
          <div className="progress-container">
            <div className="progress"></div>
            <span className="progress-text">6/9 Challenges</span>
          </div>
          <h6>Chapter 4</h6>
          <h2>Callbacks & Closures</h2>
          <button className="btn">Continue</button>
        </div>
      </div>
    </div>
    // <Card
    //   sx={{
    //     maxHeight: 400,
    //     maxWidth: 800,
    //     margin: "16px auto",
    //     display: "flex",
    //     borderRadius: "15px",
    //     backgroundColor: "rgba(115, 173, 179, 0.8)",
    //   }}
    // >
    //   <div
    //     style={{
    //       display: "flex",
    //       flexDirection: "column",
    //       alignItems: "center",
    //       justifyContent: "center",
    //       margin: "16px",
    //       width: "100px", // Ajusta el ancho deseado
    //     }}
    //   >
    //     <CardMedia
    //       component="img"
    //       height="60" // Establece la altura deseada
    //       image={avatarUrl}
    //       alt="Foto de perfil"
    //       sx={{
    //         width: "60px",
    //         borderRadius: "50%",
    //         marginBottom: "8px",
    //       }}
    //     />
    //     <Typography variant="body2" color="text.secondary">
    //       {host?.username}
    //     </Typography>
    //   </div>
    //   <CardActionArea>
    //     <CardContent>
    //       <Typography gutterBottom variant="h5" component="div">
    //         Origen: {travel.origin}
    //       </Typography>
    //       <Typography variant="body2" color="text.secondary">
    //         Destino: {travel.destination}
    //       </Typography>
    //       <Typography variant="body2" color="text.secondary">
    //         Fecha del viaje: {travel.start_date}
    //       </Typography>
    //       <Typography variant="body2" color="text.secondary">
    //         Duración estimada: {travel.estimated_duration}
    //       </Typography>
    //       <Typography variant="body2" color="text.secondary">
    //         Precio por plaza: {travel.price}
    //       </Typography>
    //       <Typography variant="body2" color="text.secondary">
    //         Paradas: {travel.stops}
    //       </Typography>
    //       <Typography variant="body2" color="text.secondary">
    //         Estado: {travel.status}
    //       </Typography>
    //     </CardContent>
    //   </CardActionArea>
    //   <CardActions>
    //     <Button classNameName="" size="small" color="primary">
    //       Reservar plaza
    //     </Button>
    //   </CardActions>
    // </Card>
  );
};

export default TravelCard;

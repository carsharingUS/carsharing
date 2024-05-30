import React from "react";
import { Travel } from "../../Interfaces";
import {
  Button,
  TableCell,
  TableContainer,
  Table,
  TableBody,
  TableRow,
  Paper,
  IconButton,
  TableHead,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import "./UserProfile.css";

interface UserActivitySummaryProps {
  userTravels: Travel[];
  handleView: (travelId: number) => void;
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  const hours = date.getHours();
  const minutes =
    date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();

  return `${day}/${month}/${year} ${hours}:${minutes}`;
};

const UserActivitySummary: React.FC<UserActivitySummaryProps> = ({
  userTravels,
  handleView,
}) => {
  return (
    <>
      {userTravels.length > 0 && (
        <div className="overflow-x-auto">
          <TableContainer component={Paper}>
            <Table>
              <TableHead style={{ backgroundColor: "#86B6F6" }}>
                <TableRow>
                  <TableCell style={{ width: "10%", textAlign: "center" }}>
                    <b>Anfitrión</b>
                  </TableCell>
                  <TableCell style={{ width: "25%", textAlign: "center" }}>
                    <b>Origen</b>
                  </TableCell>
                  <TableCell style={{ width: "25%", textAlign: "center" }}>
                    <b>Destino</b>
                  </TableCell>
                  <TableCell style={{ width: "20%", textAlign: "center" }}>
                    <b>Inicio</b>
                  </TableCell>
                  <TableCell style={{ width: "10%", textAlign: "center" }}>
                    <b>Precio</b>
                  </TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {userTravels.map((travel: Travel) => (
                  <TableRow key={travel.id}>
                    <TableCell style={{ width: "10%", textAlign: "center" }}>
                      {travel.host?.username}
                    </TableCell>
                    <TableCell style={{ width: "25%", textAlign: "center" }}>
                      {travel.origin}
                    </TableCell>
                    <TableCell style={{ width: "25%", textAlign: "center" }}>
                      {travel.destination}
                    </TableCell>
                    <TableCell style={{ width: "20%", textAlign: "center" }}>
                      {formatDate(travel.start_date)}
                    </TableCell>
                    <TableCell style={{ width: "10%", textAlign: "center" }}>
                      {travel.price} €
                    </TableCell>
                    <TableCell style={{ width: "10%", textAlign: "center" }}>
                      <IconButton onClick={() => handleView(travel.id)}>
                        <VisibilityIcon />
                      </IconButton>
                    </TableCell>{" "}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      )}
    </>
  );
};

export default UserActivitySummary;

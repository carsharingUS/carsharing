import React, { useState, useEffect } from "react";
import { Room } from "../../Interfaces";
import Navbar from "../../components/home/Navbar";
import "../../components/travels/TravelCard.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Loader from "../../components/Loader";
import toast from "react-hot-toast";
import NoTravelFound from "../../components/travels/NoTravelFound";
import { useNavigate } from "react-router-dom";
import { getUserRooms } from "../../api/ChatService";
import { getCurrentUser } from "../../utils";
import { useQuery } from "@tanstack/react-query";

const ChatsPage = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const navigate = useNavigate();
  const { data: user } = getCurrentUser();

  const { data, isError, isLoading } = useQuery({
    queryKey: ["user", user],
    queryFn: () => getUserRooms(user.id),
  });

  useEffect(() => {
    if (data) {
      setRooms(data);
    }
  }, [data]);

  const getOtherUser = (room: Room) => {
    if (room && room.users) {
      const otherUser = room.users.find((u) => u.id !== user.id);
      return otherUser ? `${otherUser.username}` : "Desconocido";
    } else {
      return "Desconocido";
    }
  };

  if (isLoading) return <Loader />;
  if (isError) return toast.error("Error!");

  return (
    <div>
      <Navbar />
      <div className="container mt-4">
        <h2>Chats</h2>
        <div className="row">
          {rooms.length > 0 ? (
            rooms.map((room) => (
              <div key={room.id} className="col-lg-4 col-md-6 mb-4">
                <div className="card h-100">
                  <div className="card-body">
                    <h5 className="card-title">
                      Chat con {getOtherUser(room)}
                    </h5>
                    <button
                      className="btn btn-primary"
                      onClick={() => navigate(`/chat/${room.name}`)}
                    >
                      Ir al chat
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <NoTravelFound />
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatsPage;

import React, { useState, useEffect } from "react";
import { Room, Message, ChatMessage } from "../../Interfaces";
import Navbar from "../../components/home/Navbar";
import "../../components/chat/ChatsPage.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Loader from "../../components/Loader";
import toast from "react-hot-toast";
import SelectChat from "../../components/chat/SelectChat";
import StartChat from "../../components/chat/StartChat";
import { getUserRooms } from "../../api/ChatService";
import { getCurrentUser } from "../../utils";
import { useQuery } from "@tanstack/react-query";
import { getMessages } from "../../api/ChatService";
import Chat from "../../components/chat/Chat";

const ChatsPage = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [messageSent, setMessageSent] = useState(false);
  const [lastMessages, setLastMessages] = useState<{
    [roomId: string]: ChatMessage;
  }>({});
  const [selectedRooms, setSelectedRooms] = useState<Room[]>([]);

  const { data: user } = getCurrentUser();
  const { data, isError, isLoading } = useQuery({
    queryKey: ["user", user],
    queryFn: () => getUserRooms(user.id),
  });

  useEffect(() => {
    if (data) {
      setRooms(data);
      fetchLastMessages(data);
    }
  }, [data]);

  const fetchLastMessages = async (rooms: Room[]) => {
    const lastMessagesPromises = rooms.map(async (room) => {
      const messages = await getMessages(room.id);
      const lastMessage = messages[messages.length - 1];
      return { [room.id]: lastMessage };
    });
    const lastMessagesObjects = await Promise.all(lastMessagesPromises);
    const mergedLastMessages = Object.assign({}, ...lastMessagesObjects);
    setLastMessages(mergedLastMessages);
    setMessageSent(false); // Establece messageSent en false después de actualizar la lista de mensajes
  };

  useEffect(() => {
    if (messageSent) {
      fetchLastMessages(rooms);
    }
  }, [messageSent, rooms, fetchLastMessages]);

  const updateLastMessage = (roomId, message) => {
    setLastMessages((prevLastMessages) => ({
      ...prevLastMessages,
      [roomId]: message,
    }));
  };

  const getOtherUser = (room: Room) => {
    if (room && room.users) {
      const otherUser = room.users.find((u) => u.id !== user.id);
      return otherUser ? `${otherUser.username}` : "Desconocido";
    } else {
      return "Desconocido";
    }
  };

  const handleChatClick = (room: Room) => {
    setSelectedRooms((prevSelectedRooms) => {
      if (prevSelectedRooms.length > 0) {
        return [room];
      } else {
        return [...prevSelectedRooms, room];
      }
    });
  };

  if (isError) return toast.error("Error!");

  return (
    <div>
      <Navbar />
      <div className="container-fluid mt-4">
        {isLoading && <Loader />}
        {rooms.length > 0 ? (
          <div className="row">
            <div className="col-4">
              <h2 className="chats-header">Chats</h2>
              <div className="chat-list">
                {rooms.map((room) => (
                  <div
                    key={room.id}
                    className={`chat-item ${
                      selectedRooms.includes(room) ? "selected-chat" : ""
                    }`}
                    onClick={() => handleChatClick(room)}
                  >
                    <div
                      className="card h-100 transparent-chat"
                      style={{
                        width: "100%",
                        borderRadius: "0",
                      }}
                    >
                      <div className="card-body">
                        <h5 className="card-title">{getOtherUser(room)}</h5>
                        <p className="card-text">
                          {lastMessages[room.id]?.sender === user.username
                            ? "Tú: "
                            : lastMessages[room.id]?.sender + ": "}
                          {lastMessages[room.id]?.text || "No hay mensajes"}
                        </p>
                        <p className="last-message-date">
                          {lastMessages[room.id]?.timestamp
                            ? new Date(
                                lastMessages[room.id].timestamp
                              ).toLocaleString()
                            : ""}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="col-8">
              {selectedRooms.length > 0 ? (
                selectedRooms.map((selectedRoom) => (
                  <div key={selectedRoom.id} className="chat-container">
                    <Chat room={selectedRoom} />
                  </div>
                ))
              ) : (
                <SelectChat />
              )}
            </div>
          </div>
        ) : (
          <StartChat />
        )}
      </div>
    </div>
  );
};

export default ChatsPage;

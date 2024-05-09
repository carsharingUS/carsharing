import React, { useState, useEffect, useRef } from "react";
import "../chat/ChatPanel.css";
import { getCurrentUser } from "../../utils";
import { ChatMessage, Message } from "../../Interfaces";
import {
  createMessage,
  createRoom,
  getMessages,
  getRoomByUsers,
} from "../../api/ChatService";
import { useParams } from "react-router-dom";
import { getTravel } from "../../api/TravelService";

const Chat = () => {
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const { data: user } = getCurrentUser();
  const { travelId } = useParams();

  const socketRef = useRef<WebSocket>();
  const roomIdRef = useRef<number | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const getUserFromTravel = async () => {
      console.log(travelId);
      const travel = await getTravel(travelId);
      const hostUserId = travel.host;
      connectToWebSocket(hostUserId.id);
    };

    const connectToWebSocket = async (hostUserId) => {
      try {
        const existingRoomData = await getRoomByUsers(user.id, hostUserId);
        let roomId;
        if (existingRoomData) {
          roomId = existingRoomData.id;
        } else {
          const roomData = await createRoom(user.id, hostUserId);
          roomId = roomData.room_id;
        }
        roomIdRef.current = roomId;

        if (
          !socketRef.current ||
          socketRef.current.readyState !== WebSocket.OPEN
        ) {
          socketRef.current = new WebSocket(
            `ws://127.0.0.1:8000/ws/room/${existingRoomData.name}/`
          );

          socketRef.current.onmessage = (event) => {
            const newMessage = JSON.parse(event.data);
            setChatHistory((prevHistory) => [...prevHistory, newMessage]);
          };

          if (chatHistory.length === 0) {
            getMessages(roomId)
              .then((response) => {
                setChatHistory(response.data);
              })
              .catch((error) => {
                console.error("Error fetching messages:", error);
              });
          }
        }
      } catch (error) {
        console.error("Error connecting to WebSocket:", error);
      }
    };

    getUserFromTravel();

    return () => {
      if (socketRef.current) {
        socketRef.current.onmessage = null;
        socketRef.current.close();
      }
    };
  }, [travelId, user, chatHistory]);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "auto" });
    }
  }, [chatHistory]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      sendMessage();
    }
  };

  const sendMessage = () => {
    if (message.trim() !== "") {
      const roomId = roomIdRef.current ?? 0;

      const messageData: Message = {
        text: message,
        sender: user,
        room_id: roomId,
      };

      if (
        socketRef.current &&
        socketRef.current.readyState === WebSocket.OPEN
      ) {
        socketRef.current.send(
          JSON.stringify({
            text: message,
            sender: user.username,
            room_id: roomId,
          })
        );
      }

      setMessage("");

      createMessage(messageData)
        .then((response) => {
          console.log("Message created successfully:", response.data);
        })
        .catch((error) => {
          console.error("Error creating message:", error);
        });
    }
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    if (date.toString() === "Invalid Date") {
      return new Date().toLocaleString();
    } else {
      return date.toLocaleString();
    }
  };

  return (
    <div className="chat-panel" id="chat-panel">
      <div className="conversation">
        {chatHistory.map((msg, index) => (
          <div
            key={index}
            className={`message-container ${
              msg.sender === user.username ? "sent-message" : "received-message"
            }`}
          >
            <div className="message-sender">
              <strong>{msg.sender}</strong>
            </div>
            <div
              className={`message ${
                msg.sender === user.username ? "sent" : "received"
              }`}
            >
              {msg.text}
            </div>
            <div className="message-timestamp">{formatDate(msg.timestamp)}</div>
          </div>
        ))}
        <div ref={chatEndRef}></div>
      </div>
      <div className="message-input">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown} // Agrega el manejador de eventos para la tecla Enter
          placeholder="Type your message..."
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default Chat;

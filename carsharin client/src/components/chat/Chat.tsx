import React, { useState, useEffect } from "react";
import "./styles.css";
import { getCurrentUser } from "../../utils";
import { authAPI } from "../../api/AuthenticationService";

interface ChatMessage {
  text: string;
  sender: string;
}

const socket = new WebSocket("ws://127.0.0.1:8000/ws/room/1/");

function Chat() {
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);

  const { data: user } = getCurrentUser();

  useEffect(() => {
    // Obtener mensajes al cargar el componente
    authAPI
      .get("/chat/room/1/messages/")
      .then((response) => {
        setChatHistory(response.data);
      })
      .catch((error) => {
        console.error("Error fetching messages:", error);
      });

    // Event listener para mensajes del servidor
    socket.onmessage = (event) => {
      const newMessage: ChatMessage = JSON.parse(event.data);
      setChatHistory((prevHistory) => [...prevHistory, newMessage]);
    };
  }, []);

  const sendMessage = () => {
    if (message.trim() !== "") {
      const messageData = {
        text: message,
        sender: user,
        room_id: 1,
      };
      // Enviar mensaje al servidor
      socket.send(
        JSON.stringify({
          text: message,
          sender: user.username,
          room_id: 1,
        })
      );

      // Limpiar el campo de entrada
      setMessage("");
      authAPI
        .post(`/chat/room/create_message/`, messageData)
        .then((response) => {
          console.log("Message created successfully:", response.data);
        })
        .catch((error) => {
          console.error("Error creating message:", error);
        });
    }
  };

  return (
    <div className="App">
      <div className="ChatContainer">
        <div className="ChatHistory">
          {chatHistory.map((msg, index) => (
            <div key={index}>
              <strong>{msg.sender}: </strong> {msg.text}
            </div>
          ))}
        </div>
        <div className="ChatInput">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
          />
          <button onClick={sendMessage}>Send</button>
        </div>
      </div>
    </div>
  );
}

export default Chat;

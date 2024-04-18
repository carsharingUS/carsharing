import React, { useState, useEffect } from "react";
import { ChatService } from "../../api/ChatService";
import { User, Message } from "../../Interfaces";
import "../chat/ChatPanel.css";

const ChatPanel: React.FC<{ user: User }> = ({ user }) => {
  const [conversation, setConversation] = useState<Message[]>([]);
  const [messageInput, setMessageInput] = useState("");

  useEffect(() => {
    const fetchConversation = async () => {
      try {
        const messages = await ChatService.getConversation(user);
        setConversation(messages);
      } catch (error) {
        console.error("Error al obtener la conversación:", error);
      }
    };

    fetchConversation();
  }, [user]);

  const sendMessage = async () => {
    try {
      if (messageInput.trim() !== "") {
        await ChatService.sendMessage(
          user,
          messageInput,
          conversation[0].conversation
        );
        setMessageInput("");
      }
    } catch (error) {
      console.error("Error al enviar el mensaje:", error);
    }
  };
  console.log("USER ID:" + user.username);
  return (
    <div className="chat-panel">
      <div className="conversation">
        {conversation.map((message, index) => (
          <div
            key={index}
            className={`message ${
              message.sender === user.id ? "sent" : "received"
            }`}
          >
            {message.sender_username === user.username ? (
              <div className="received-message">{message.content}</div>
            ) : (
              <div className="sent-message">{message.content}</div>
            )}
          </div>
        ))}
      </div>
      <div className="message-input">
        <input
          type="text"
          placeholder="Escribe un mensaje..."
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
        />
        <button onClick={sendMessage}>Enviar</button>
      </div>
    </div>
  );
};

export default ChatPanel;

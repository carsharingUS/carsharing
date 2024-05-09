import { Message, User } from "../Interfaces";
import { API, authAPI } from "./AuthenticationService";

// Usar en un futuro
export const createWebsocket = async (roomId: number) => {
  const socket = new WebSocket("ws://127.0.0.1:8000/ws/room/"+roomId+"/");
  return socket;
}

// Send a get request to the api endpoint to get the message of the logged in user
export const getMessages = async (roomId: string) => {
  const response = await authAPI.get("/chat/room/"+roomId+"/messages/")
  return response;
}

export const createMessage = async (data: Message) => {
  const response = await authAPI.post(`/chat/room/create_message/`, data)
  return response;
}

export const createRoom = async (user1, user2) => {
  try {
    const response = await API.post(`/chat/room/create_room/${user1}/${user2}/`);
    return response.data;
  } catch (error) {
      throw new Error('Error al crear la sala de chat: ' + error.message);
  }
}

export const checkRoomExists = async (user1Id, user2Id) => {
  try {
    const response = await API.get(`/chat/room/check_room_exists/${user1Id}/${2}`);
    return response.data.room_exists;
  } catch (error) {
    console.error('Error checking room existence:', error);
    return false;
  }
};

export const getRoomByUsers = async (user1Id, user2Id) => {
  try {
    const response = await API.get(`/chat/room/get_room_by_users/${user1Id}/${user2Id}/`);
    return response.data;
  } catch (error) {
    console.error('Error checking room existence:', error);
    return false;
  }
};





export const ChatService = {
  getRecentUsers: async (): Promise<string[]> => {
    try {
      const response = await authAPI.get("chat/recent-users/");
      return response.data;
    } catch (error) {
      console.error('Error al obtener los usuarios recientes:', error);
      throw error;
    }
  },

  searchUser: async (query: string): Promise<User | null> => {
    try {
      const response = await authAPI.get(`chat/search-user?query=${query}`);

      if (response.data) {
        return response.data as User;
      } else {
        return null;
      }
    } catch (error) {
      console.error('Error al buscar usuario:', error);
      throw error;
    }
  },

  getConversation: async (user: User): Promise<Message[]> => {
    try {
      const response = await authAPI.get(`chat/conversations/${user.username}`);
      const transformedData = response.data.map((item: any) => ({
        conversation: item.conversation,
        sender: item.sender,
        sender_username: item.sender.username,
        content: item.content
      }));
      console.log(response.data.map(item => {
        return {
          conversation: item.conversation,
          sender: item.sender,
          sender_username: item.sender.username,
          content: item.content
        }
      }))
      return transformedData;

    } catch (error) {
      console.error('Error al obtener la conversación:', error);
      throw error;

    }
  },

  sendMessage: async (user, message, roomName) => {
    try {
      // Establecer la conexión WebSocket
      const ws = new WebSocket(`ws://localhost:8000/ws/chat/${roomName}/`);

      // Manejar eventos de WebSocket
      ws.onopen = () => {
        // Enviar el mensaje al servidor
        ws.send(JSON.stringify({
          message,
          sender: user.id, // Suponiendo que user tiene una propiedad 'id'
        }));
      };

      ws.onerror = (error) => {
        console.error('Error en la conexión WebSocket:', error);
      };

      ws.onclose = () => {
        console.log('Conexión WebSocket cerrada');
      };
    } catch (error) {
      console.error('Error al enviar el mensaje:', error);
      throw error;
    }
  },


};

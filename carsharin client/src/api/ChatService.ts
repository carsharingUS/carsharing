import { Message, User } from "../interfaces";
import { API, authAPI } from "./AuthenticationService";

// Send a get request to the api endpoint to get the message of the logged in user
export const getMyMessages = async (data: User) => {
  const response = await authAPI.get("/chat/" + '/my-messages/' + data.id + "/")
}


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

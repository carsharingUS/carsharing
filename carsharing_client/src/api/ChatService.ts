import { AxiosResponse } from "axios";
import { ChatMessage, Message, Room, User } from "../Interfaces";
import { API, authAPI } from "./AuthenticationService";

// Usar en un futuro

// Send a get request to the api endpoint to get the message of the logged in user
export const getMessages = async (roomId: string): Promise<ChatMessage[]> => {
  const response: AxiosResponse<ChatMessage[]> = await authAPI.get(
    `/chat/room/${roomId}/messages/`
  );
  return response.data;
};

export const createMessage = async (data: Message) => {
  const response = await authAPI.post(`/chat/room/create_message/`, data);
  return response;
};

export const createRoom = async (user1, user2) => {
  try {
    const response = await API.post(
      `/chat/room/create_room/${user1}/${user2}/`
    );
    return response.data;
  } catch (error) {
    throw new Error("Error al crear la sala de chat: " + error.message);
  }
};

export const checkRoomExists = async (user1Id, user2Id) => {
  try {
    const response = await API.get(
      `/chat/room/check_room_exists/${user1Id}/${2}`
    );
    return response.data.room_exists;
  } catch (error) {
    console.error("Error checking room existence:", error);
    return false;
  }
};

export const getOrCreateRoomByUsers = async (user1Id, user2Id) => {
  try {
    const response = await API.get(
      `/chat/room/get_or_create_room/${user1Id}/${user2Id}/`
    );
    return response.data;
  } catch (error) {
    console.error("Error checking room existence:", error);
    return false;
  }
};

export const getUserRooms = async (userId: string): Promise<Room[]> => {
  try {
    const response = await authAPI.get(`/chat/room/get_user_rooms/${userId}/`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener las salas del usuario:", error);
    throw error;
  }
};

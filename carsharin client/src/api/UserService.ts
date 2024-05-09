import { User } from '../Interfaces';
import { API, authAPI } from './AuthenticationService';

export const registerRequest = async (username: string, email: string, name: string, last_name: string, password: string) => {
    await API.post("/user/register/", { username, email, name, last_name, password })
};

export const loginRequest = async (email: string, password: string) => {
    const response = await API.post("/user/login/", { email: email, password: password })
    return response;
};

export const edit_user = async (data: User) => {
    const formData = new FormData();
    formData.append("name", data.name)
    formData.append("last_name", data.last_name)
    formData.append("username", data.username)
    formData.append("email", data.email)
    if (data.description){
        formData.append("description", data.description)
    }
    if(data.phone){
        formData.append("phone", data.phone)
    }
    if(data.sex){
        formData.append("sex", data.sex)
    }
    if (data.avatar){
        formData.append("avatar", data.avatar)
    }
    await authAPI.put(`/user/edit/${data.username}/`, formData)
}

export const get_solo_user = async (id: number) => {
    const response = await authAPI.get(`/user/get/solo/${id}/`)
    return response.data

}

export const getUserByUsername = async (username: string) => {
    const response = await authAPI.get(`/user/get/${username}/`)
    return response.data
}

export const getUser = async (id: number | undefined) => {
    if(!id){
        throw new Error('Compruebe el id')
    }
    const response = await API.get(`/user/${id}`)
    return response.data;
}

export const createChatRoom = async (user1Id: number, user2Id: number) => {
    try {
        const response = await API.post('/chat/create_room/', {
            user1_id: user1Id,
            user2_id: user2Id
        });
        return response.data;
    } catch (error) {
        throw new Error('Error al crear la sala de chat: ' + error.message);
    }
};

export const getWebsocketToken = async (user1Id: number, user2Id: number) => {
    try {
        if(!user1Id || !user2Id){
            throw new Error('Compruebe el id')
        }
        const response = await API.get(`/user/get_websocket_token/${user1Id}/${user2Id}`)
        return response.data;
    } catch (error) {
        throw new Error('Error al obtener el token de la sala: ' + error.message);
    }
};
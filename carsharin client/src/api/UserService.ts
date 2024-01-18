import { User } from '../../Interfaces';
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

export const getUser = async (id: number | undefined) => {
    if(!id){
        throw new Error('Compruebe el id')
    }
    const response = await API.get(`/user/${id}`)
    return response.data;
}
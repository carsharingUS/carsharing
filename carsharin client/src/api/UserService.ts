import { API } from './AuthenticationService';

export const registerRequest = async (username: string, email: string, name: string, last_name: string, password: string) => {
    await API.post("/user/register/", { username, email, name, last_name, password })
};

export const loginRequest = async (email: string, password: string) => {
    const response = await API.post("/user/login/", { email: email, password: password })
    return response;
};

export const getUser = async (id: number | undefined) => {
    if(!id){
        throw new Error('Compruebe el id')
    }
    const response = await API.get(`/user/${id}`)
    return response.data;
}

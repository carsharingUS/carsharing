import axios from 'axios'

const userApi = axios.create({
    baseURL: 'http://localhost:8000/user/api/v1/CustomUser/'
})

export const getAllUser = () => { //Se puede hacer de esta manera 
    return userApi.get("/");

}
export const createUser = (user) => userApi.post("/", user); //O de esta otra manera
export const deleteUser = (id) => userApi.delete(`/${id}`);
export const updateuser = (id, user) => userApi.put(`/${id}/`, user);
export const getUser = (id) => userApi.get(`/${id}/`);
import axios from 'axios'

const userApi = axios.create({
    baseURL: 'http://localhost:8000/user/'
})

export const getAllUser = () => { //Se puede hacer de esta manera 
    return userApi.get("/");

}
export const createUser = (user) => userApi.post("/", user); //O de esta otra manera
export const deleteUser = (id) => userApi.delete(`/${id}`);
export const updateuser = (id, user) => userApi.put(`/${id}/`, user);
export const getUser = (id) => userApi.get(`/${id}/`);
export const loginUser = (usuario) => userApi.get(`/api/login`, usuario) 
export const getUsuarioObjeto = (username, password) => userApi.get(`/user/api/getUsuario/`)

export const registerRequest = async (username: string, email: string, name: string, last_name: string, password: string) => {
    axios.post("http://localhost:8000/user/register/", {username, email, name, last_name, password})
};
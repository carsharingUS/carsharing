import axios, { AxiosRequestHeaders } from 'axios'
import { useAuthStore } from '../store/auth';
import * as jwt_decode from 'jwt-decode';
import { baseURL } from '../constants';


function logout() {
    useAuthStore.getState().logout()
    window.location.href = "/login"
}

export const userAPI = axios.create({
    baseURL: `${baseURL}user/`
});

//Utilizar este en cada request que se necesite autenticacion
const authUserAPI = axios.create({
    baseURL: `${baseURL}user/`,
    withCredentials: true
});

authUserAPI.interceptors.request.use(async (config) => {
    const token: string = useAuthStore.getState().access;
    config.headers = {
        Authorization: `Bearer ${token}`,
    } as AxiosRequestHeaders;

    type Token = {
        exp: number
    };

    const tokenDecoded: Token = jwt_decode.jwtDecode(token);

    const expiration = new Date(tokenDecoded.exp * 1000);
    const now = new Date();
    const fiveMin = 1000 * 60 * 5;

    if (expiration.getTime() - now.getTime() < fiveMin)
        try {
            const response = await userAPI.post('/refresh/', { refresh: useAuthStore.getState().refresh })
            useAuthStore.getState().setToken(response.data.access, response.data.refresh)
        } catch (err) {
            logout()
        }
    return config
});


export const getAllUser = () => { //Se puede hacer de esta manera 
    return userAPI.get("/");
}

export const createUser = (user) => userAPI.post("/", user); //O de esta otra manera
export const deleteUser = (id) => userAPI.delete(`/${id}`);
export const updateuser = (id, user) => userAPI.put(`/${id}/`, user);
export const getUser = (id) => userAPI.get(`/${id}/`);
export const loginUser = (usuario) => userAPI.get(`/api/login`, usuario)
export const getUsuarioObjeto = (username, password) => userAPI.get(`/user/api/getUsuario/`)

export const registerRequest = async (username: string, email: string, name: string, last_name: string, password: string) => {
    await userAPI.post("/register/", { username, email, name, last_name, password })
};

export const loginRequest = async (email: string, password: string) => {
    const response = await userAPI.post("/login/", { email: email, password: password })
    return response;
};

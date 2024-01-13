import axios, { AxiosRequestHeaders } from 'axios'
import { useAuthStore } from '../store/auth';
import * as jwt_decode from 'jwt-decode';


function logout() {
    useAuthStore.getState().logout()
    window.location.href = "/login"
}

export const baseURL = 'http://localhost:8000/user/'

export const userApi = axios.create({
    baseURL
});

//Utilizar este en cada request que se necesite autenticacion
const authAxios = axios.create({
    baseURL,
    withCredentials: true
});

authAxios.interceptors.request.use(async (config) => {
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
            const response = await userApi.post('/refresh/', { refresh: useAuthStore.getState().refresh })
            useAuthStore.getState().setToken(response.data.access, response.data.refresh)
        } catch (err) {
            logout()
        }
    return config
});


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
    await userApi.post("/register/", { username, email, name, last_name, password })
};

export const loginRequest = async (email: string, password: string) => {
    const response = await userApi.post("/login/", { email: email, password: password })
    return response;
};


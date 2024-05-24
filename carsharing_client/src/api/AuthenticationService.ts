import axios, { AxiosRequestHeaders } from 'axios'
import { useAuthStore } from '../store/auth';
import * as jwt_decode from 'jwt-decode';
import { baseURL } from '../constants';

function logout() {
    useAuthStore.getState().logout()
    window.location.href = "/login"
}

export const API = axios.create({
    baseURL: baseURL
});

//Utilizar este en cada request que se necesite autenticacion
export const authAPI = axios.create({
    baseURL: baseURL,
    withCredentials: true
});

authAPI.interceptors.request.use(async (config) => {
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
            const response = await API.post('/user/refresh/', { refresh: useAuthStore.getState().refresh })
            useAuthStore.getState().setToken(response.data.access, response.data.refresh)
        } catch (err) {
            logout()
        }
    return config
});
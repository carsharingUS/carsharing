import axios from "axios";
import { baseURL } from "../constants";

export const travelAPI = axios.create({
    baseURL: `${baseURL}travels/`
})

export const authTravelAPI = axios.create({
    baseURL: `${baseURL}travels/`,
    withCredentials: true
})

export const getAllTravels = async  () => {
    const response = await travelAPI.get("/");
    return response.data;
}

export const getTravel = async (origin: string | undefined, destination: string | undefined) => {
    if(!origin || !destination){
        throw new Error('Compruebe el origen y destino')
    }
    const response = await travelAPI.get(`/${origin}-${destination}`)
    return response.data;
}
import { API } from "./AuthenticationService";

export const getAllTravels = async  () => {
    const response = await API.get("/travels");
    return response.data;
}

export const getTravel = async (origin: string | undefined, destination: string | undefined) => {
    if(!origin || !destination){
        throw new Error('Compruebe el origen y destino')
    }
    const response = await API.get(`travels/${origin}-${destination}`)
    return response.data;
}
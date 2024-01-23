import { API, authAPI } from "./AuthenticationService";
import { Travel } from "../Interfaces"; 

export const getAllTravels = async  () => {
    const response = await API.get("/travels");
    return response.data;
};

export const getTravel = async (origin: string | undefined, destination: string | undefined) => {
    if(!origin || !destination){
        throw new Error('Compruebe el origen y destino')
    }
    const response = await API.get(`travels/${origin}-${destination}`)
    return response.data;
}

export const getUserTravels =async () => {
    const response = await authAPI.get("travels/my/travels/")
    return response.data
    
}
export const createTravel = async (data: Partial<Travel>) => {
    const formData = new FormData();
    formData.append("origin", data.origin || "")
    formData.append("destination", data.destination || "")
    formData.append("start_date", data.start_date || "")
    formData.append("estimated_duration", data.estimated_duration || "")
    formData.append("price", data.price?.toString() || "")
    formData.append("stops", data.stops || "")
    
    await authAPI.post('travels/create/', formData)
};

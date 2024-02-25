import { API, authAPI } from "./AuthenticationService";
import { Travel } from "../Interfaces"; 


/**
 * TODO: Hacer el getTravels aplicando filtros. Por ejemplo: origen, destino, fecha...
 */
export const getAllTravels = async  () => {
    const response = await API.get("/travels");
    return response.data;
};

export const getTravel = async (id: string) => {
    if(!id){
        throw new Error('Compruebe el origen y destino')
    }
    const response = await API.get(`travels/${id}`)
    console.log(response.data)
    return response.data
}

export const getUserTravels =async () => {
    const response = await authAPI.get("travels/my_travels")
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

export const deleteTravel = async (id: number) => {
    return authAPI.delete(`travels/delete/${id}`)
}


/*
export interface Travel {
    id?: number;
    host: string;
    passenger: string;
    origin: string;
    destination: string;
    start_date: string;
    estimated_duration: string;
    price: string;
    stops: string;
    status: string;
}
*/

export interface TravelRequest {
    id: number;
    user?: User;
    travel?: Travel;
    intermediate: string;
    seats: number;
    status: 'pendiente' | 'aceptado' | 'rechazado';
}

export interface Travel {
    id: number;
    host?: User;
    passengers?: number[];
    origin: string;
    destination: string;
    start_date: string;
    estimated_duration: string;
    price: number;
    stops: string | null;
    status: 'programado' | 'en_curso' | 'completado';
    total_seats: number;
    clasificacion_origen?: string; // Campo opcional para clasificación del origen
    clasificacion_destino?: string; // Campo opcional para clasificación del destino
    mejor_opcion?:boolean;
}

export interface User {
    id?: number;
    avatar: File | null;
    username: string,
    email: string;
    name: string;
    last_name: string;
    phone: string;
    sex: string;
    description: string;
};

export interface Token {
    user_id: number;
    exp: number;
    is_staff: boolean;

    username: string;
    email: string;
    name: string;
    last_name: string;
    avatar: File | null;
    phone: string;
    sex: string;
    description: string;
}

export interface Coordinates {
    latitude: string;
    longitude: string;
}

export interface ChatMessage {
    id: string;
    text: string;
    sender: string;
    timestamp: string;
  }

  export interface Message {
    text: string;
    sender: User;
    room_id: number;
  }

  export interface Room {
    id: string;
    name: string;
    users: User[];
  }
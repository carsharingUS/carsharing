

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

/* export interface Travel {
    id?: number;
    host: number;
    passengers?: number[];
    origin: string;
    destination: string;
    start_date: string;
    estimated_duration: string;
    price: number;
    stops: string | null;
    status: 'programado' | 'en_curso' | 'completado';
  } */


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
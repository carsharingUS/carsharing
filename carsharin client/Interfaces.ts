

export interface User {
    id?: number;
    avatar: File | null;
    username: string,
    email: string;
    name: string;
    last_name: string;
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
}
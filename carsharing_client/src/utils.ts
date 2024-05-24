// utils.js

import * as jwt_decode from "jwt-decode";
import { useAuthStore } from "./store/auth";
import { Token } from "./Interfaces";
import { useQuery } from "@tanstack/react-query";
import { get_solo_user } from "./api/UserService";

export function getCurrentUser() {
    const token: string = useAuthStore.getState().access;
    const tokenDecoded: Token = jwt_decode.jwtDecode(token);
    const id = tokenDecoded.user_id;

  return useQuery({
    queryKey: ["user", id],
    queryFn: () => get_solo_user(id),
  });
}

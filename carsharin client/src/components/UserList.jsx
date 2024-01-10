import { useEffect, useState } from "react";
import { getAllUser } from "../api/User.api";
import { UserCard } from "./UserCard";

export function UserList(){

    const [user,  setUser] = useState([]);

    useEffect(() => {
        
        async function loadAllUser(){
            const res = await getAllUser();
        
            setUser(res.data);
        }
        loadAllUser();

    }, []);

    return <div className="grid grid-cols-3 gap-3">
        {user.map(user => (
            <UserCard key={user.id} user={user} />
        ))}
    </div>;
}
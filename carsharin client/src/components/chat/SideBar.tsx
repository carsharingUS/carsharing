import React, { useState, useEffect } from 'react';
import { ChatService } from '../../api/ChatService';
import { User } from '../../interfaces';
import '../chat/SideBar.css'

const Sidebar: React.FC<{ onUserClick: (user: User) => void }> = ({ onUserClick }) => {
    const [recentUsers, setRecentUsers] = useState<User[]>([]);

    useEffect(() => {
        const fetchRecentUsers = async () => {
            try {
                const usernames = await ChatService.getRecentUsers();
                const usersData = await Promise.all(usernames.map(async (username: string) => {
                    const userData = await ChatService.searchUser(username);
                    return userData as User;
                }));
                setRecentUsers(usersData);
            } catch (error) {
                console.error('Error al obtener los usuarios recientes:', error);
            }
        };

        fetchRecentUsers();
    }, []);

    const handleUserSearch = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);
        const query = formData.get('search') as string;
        try {
            const user = await ChatService.searchUser(query);
            if (user) {
                onUserClick(user);
            } else {
                alert('Usuario no encontrado');
            }
        } catch (error) {
            console.error('Error al buscar usuario:', error);
        }
    };

    return (
        <div className="sidebar">
            <div className="search-bar">
                <form onSubmit={handleUserSearch}>
                    <input type="text" name="search" placeholder="Buscar usuarios" />
                    <button type="submit">Buscar</button>
                </form>
            </div>
            <div className="recent-users">
                <h2>Usuarios Recientes</h2>
                <ul>
                    {recentUsers.map((user, index) => (
                        <li key={index} onClick={() => onUserClick(user)}>{user.username}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default Sidebar;

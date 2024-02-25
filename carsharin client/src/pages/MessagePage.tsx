import React, { useState } from 'react';
import Sidebar from '../components/chat/SideBar';
import ChatPanel from '../components/chat/ChatPanel';
import Navbar from '../components/home/Navbar'
import { User } from '../interfaces';

const ChatPage: React.FC = () => {
    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    const handleUserClick = (user: User) => {
        setSelectedUser(user);
    };

    return (
        <div className="chat-page">
            <Navbar />
            <div className="chat-container">
                <Sidebar onUserClick={handleUserClick} />
                {selectedUser && <ChatPanel user={selectedUser} />}
            </div>
        </div>
    );
}

export default ChatPage;

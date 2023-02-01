import React from 'react';
import ChatRoomList from './ChatRoomList';
import Chat from './chat';
import instance from '../confs/axios_information';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import io, {Socket} from "socket.io-client";

export interface Room {
    id: number;
    name: string;
}

const ChatInterface: React.FC = () => {
    const [rooms, setRooms] = useState<Room[]>([]);
    const [newRoomName, setNewRoomName] = useState('');
    const { id } = useParams<{ id: string | undefined }>();
    const [socket, setSocket] = useState<Socket>();
    
    useEffect(() => {
      const new_socket = io("http://localhost:8001");
      console.log('Client ID: ', new_socket.id);
      setSocket(new_socket);
    }, []);


    const handleCreateRoom = () => {
        console.log(newRoomName);
        PostNewRoom(newRoomName);
        setNewRoomName('');
      };

    async function PostNewRoom(name: string): Promise<number>{
        try {
        console.log(name);
        const response = await instance.post('chatdata/create-room', { name: name } );
        setRooms([...rooms, response.data]);
        console.log(response.data);
        return 0;
        } catch (error) {
        console.log(error);
        return 1;
        }
    }

    async function GetRooms(): Promise<number>{
        try {
        const response = await instance.get('chatdata/get-rooms');
        setRooms(response.data);
        console.log(response.data);
        return 0;
        } catch (error) {
        console.log(error);
        return 1;
        }
    }

  return (
    <div style={{ display: 'flex' }}>
      <ChatRoomList newRoomName={newRoomName} setNewRoomName={setNewRoomName} handleCreateRoom={handleCreateRoom} rooms={rooms} getRooms={GetRooms} socket={socket}/>
      <Chat id={id} socket={socket}/>
    </div>
  );
};

export default ChatInterface;
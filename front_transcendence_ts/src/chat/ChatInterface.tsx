import React from 'react';
import ChatRoomList from './ChatRoomList';
import Chat from './chat';
import instance from '../confs/axios_information';
import { useState } from 'react';
import { useParams } from 'react-router-dom';


export interface Room {
    id: number;
    name: string;
}

const ChatInterface: React.FC = () => {
    const [rooms, setRooms] = useState<Room[]>([]);
    const [newRoomName, setNewRoomName] = useState('');
    const { id } = useParams<{ id: string | undefined }>();

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
      <ChatRoomList newRoomName={newRoomName} setNewRoomName={setNewRoomName} handleCreateRoom={handleCreateRoom} rooms={rooms} getRooms={GetRooms}/>
      <Chat id={id}/>
    </div>
  );
};

export default ChatInterface;
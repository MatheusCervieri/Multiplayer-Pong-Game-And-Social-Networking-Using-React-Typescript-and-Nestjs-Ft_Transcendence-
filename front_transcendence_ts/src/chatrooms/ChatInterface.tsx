import React from 'react';
import ChatRoomList from './ChatRoomList';
import instance from '../confs/axios_information';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import io, {Socket} from "socket.io-client";
import GetToken from '../utils/GetToken';
import { serverurl } from '../confs/axios_information';
import axios from 'axios';

export interface Room {
    id: number;
    name: string;
    adm: string; 
    type: string;
    password: string;
}

export interface PostRoom
{
  name: string;
  adm: string; 
  type: string;
  password: string;
}

const socket = io("http://localhost:8001");

const ChatInterface: React.FC = () => {
    const [rooms, setRooms] = useState<Room[]>([]);
    const [newRoomName, setNewRoomName] = useState('');
    const { id } = useParams<{ id: string | undefined }>();
    const [username, setUsername] = useState<string>('');
    const navigate = useNavigate();

  useEffect(() => {
    GetToken(navigate, setUsername);
  }, []);


    const handleCreateRoom = (data: any) => {
        console.log(newRoomName);
        PostNewRoom(data);
        setNewRoomName('');
      };

    async function PostNewRoom(data: any): Promise<number>{
        try {
        data.adm = username;
        const response = await instance.post('chatdata/create-room', data );
        setRooms([...rooms, response.data]);
        PostRoomUser(response.data.id);
        console.log(response.data);
        return 0;
        } catch (error) {
        console.log(error);
        return 1;
        }
    }

    async function PostRoomUser(roomid: number)
    { try {
      const response = await axios.post(serverurl + `/chatdata/add-user-room/${roomid}`, {
        name: username
      });
      return response.data;
    } catch (error) {
      console.error(error);
    } }

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
      <ChatRoomList newRoomName={newRoomName} setNewRoomName={setNewRoomName} handleCreateRoom={handleCreateRoom} rooms={rooms} getRooms={GetRooms} socket={socket}/>
  );
};

export default ChatInterface;
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
import {postReq} from '../utils/Httprequests';

export interface Room {
    id: number;
    name: string;
    adm: string; 
    type: string;
    password: string;
    users: any[];    
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
    const [dms, setDms] = useState<Room[]>([]);	
    const [newRoomName, setNewRoomName] = useState('');
    const { id } = useParams<{ id: string | undefined }>();
    const [username, setUsername] = useState<string>('');
    const navigate = useNavigate();

  useEffect(() => {
    GetToken(navigate, setUsername);
    GetRooms();
  }, []);


    const handleCreateRoom = (data: any) => {
        console.log(newRoomName); 
        PostNewRoom(data);
        setNewRoomName('');
      };

    async function PostNewRoom(data: any): Promise<number>{
      const token = localStorage.getItem('token');
        try {
        data.adm = username;
        const response = await instance.post('room/create-room', data , 
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
        );
        setRooms([...rooms, response.data]);
        PostRoomUser(response.data.id).then((data) => {
          navigate('/chat/' + response.data.id);
        });
        console.log(response.data);
        return 0;
        } catch (error) {
        console.log(error);
        return 1;
        }
    }

    async function PostRoomUser(roomid: number)
    { 
      const token = localStorage.getItem('token');
      try {
      const response = await axios.post(serverurl + `/room/add-user-room/${roomid}`, {
        name: username
      }, 
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
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

  function btnRooms()
  {
    GetRooms();
  }
  return (
      <ChatRoomList newRoomName={newRoomName} setNewRoomName={setNewRoomName} handleCreateRoom={handleCreateRoom} rooms={rooms} getRooms={GetRooms} btnRooms={btnRooms} socket={socket} setDms={setDms} dms={dms} username={username}/>
  );
};

export default ChatInterface;
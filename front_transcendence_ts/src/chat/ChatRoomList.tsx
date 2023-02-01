import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ChatInterface from './ChatInterface';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import {Room} from './ChatInterface';
import io, {Socket} from "socket.io-client";
import { useEffect } from 'react';


interface NewRoomProps {
  newRoomName: string;
  setNewRoomName: (newRoomName: string) => void;
  handleCreateRoom: () => void;
  getRooms: () => void;
  rooms: Room[];
}

const ChatRoomList = (props: NewRoomProps) => {
  const [socket, setSocket] = useState<Socket>();

  const handleJoinRoom = (roomId: number) => {
    socket?.emit('join-room', { name:'user' , room_id: roomId});
  };

  useEffect(() => {
    const new_socket = io("http://localhost:8001");
    setSocket(new_socket);
  }, [setSocket]);

  return (
    <div>
      <h3>Chat Rooms:</h3>
      <input
        type="text"
        placeholder="Enter room name"
        value={props.newRoomName}
        onChange={(e) => props.setNewRoomName(e.target.value)}
      />
      <button onClick={props.handleCreateRoom}>Create Room</button>
      <button onClick={props.getRooms}>Get Rooms</button>
      <ul>
        {props.rooms.map((room) => (
          <>
          <Link key={room.id} to={`/chat/${room.id}`} onClick={() => handleJoinRoom(room.id)}>
          {room.name}
          <br></br>
          </Link>
         </>
        ))}
      </ul>
    </div>
  );
};

export default ChatRoomList;
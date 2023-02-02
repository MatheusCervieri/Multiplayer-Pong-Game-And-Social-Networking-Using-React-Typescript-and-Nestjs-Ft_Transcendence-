import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {Room} from './ChatInterface';
import io, {Socket} from "socket.io-client";


interface NewRoomProps {
  newRoomName: string;
  setNewRoomName: (newRoomName: string) => void;
  handleCreateRoom: () => void;
  getRooms: () => void;
  rooms: Room[];
  socket: Socket | undefined;
}

const ChatRoomList = (props: NewRoomProps) => {
  const socket = props.socket;
  const handleJoinRoom = (roomId: number) => {
    socket?.emit('join-room', { name:'user' , room_id: roomId});
  };


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
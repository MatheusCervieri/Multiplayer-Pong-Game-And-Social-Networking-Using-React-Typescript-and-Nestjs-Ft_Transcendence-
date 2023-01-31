import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ChatInterface from './ChatInterface';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import {Room} from './ChatInterface';

interface NewRoomProps {
  newRoomName: string;
  setNewRoomName: (newRoomName: string) => void;
  handleCreateRoom: () => void;
  getRooms: () => void;
  rooms: Room[];
}

const ChatRoomList = (props: NewRoomProps) => {
  
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
          <Link key={room.id} to={`/chat/${room.id}`}>
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
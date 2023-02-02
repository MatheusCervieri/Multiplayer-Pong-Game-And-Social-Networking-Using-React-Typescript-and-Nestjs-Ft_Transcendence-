import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {Room} from './ChatInterface';
import io, {Socket} from "socket.io-client";
import Createroomaux from './Createroomaux';


interface NewRoomProps {
  newRoomName: string;
  setNewRoomName: (newRoomName: string) => void;
  handleCreateRoom: (data: any) => void;
  getRooms: () => void;
  rooms: Room[];
  socket: Socket | undefined;
}

const ChatRoomList = (props: NewRoomProps) => {
  const [showForm, setShowForm] = useState(false);

  function handleCreateRoom(data: any) {
    setShowForm(!showForm);
    props.handleCreateRoom(data); //Aqui eu preciso passar as informações para criar a salaa. 
    props.setNewRoomName('');
  }

  return (
    <div>
      <h3>Chat Rooms:</h3>
      {showForm && <Createroomaux handleCreateRoom={handleCreateRoom}/>}
      <input
        type="text"
        placeholder="Enter room name"
        value={props.newRoomName}
        onChange={(e) => props.setNewRoomName(e.target.value)}
      />
      <button onClick={handleCreateRoom}>Create Room</button>
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
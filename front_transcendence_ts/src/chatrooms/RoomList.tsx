import React from 'react'
import { Link } from 'react-router-dom';
import {Room} from './ChatInterface';

interface RoomListProps {
    rooms: Room[];
}

const generateUniqueId = () => {
    return Math.floor(Math.random() * 100000000000) + Date.now();
  };

export default function RoomList(props: RoomListProps) {
  return (
    <ul>
    {props.rooms.map((room: any) => (
      <>
      <Link key={generateUniqueId()} to={`/chat/${room.id}`}>
      {room.name}
      <br></br>
      </Link>
     </>
    ))}
  </ul>
  )
}

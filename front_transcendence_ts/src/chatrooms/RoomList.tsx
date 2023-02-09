import React from 'react'
import { Link } from 'react-router-dom';
import {Room} from './ChatInterface';
import styled from 'styled-components';

interface RoomListProps {
    rooms: Room[];
}

const generateUniqueId = () => {
    return Math.floor(Math.random() * 100000000000) + Date.now();
  };
  
  const RoomListS = styled.ul`
  max-height: 200px;
  overflow-y: scroll;
  display: flex;
  flex-direction: column;
  margin-left: -35px;
  
  ::-webkit-scrollbar {
    width: 8px;
    background-color: #F5F5F5;
  }
  
  ::-webkit-scrollbar-thumb {
    border-radius: 10px;
    -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,.3);
    background-color: #A9A9A9;
  }
`;

const RoomS = styled.li`
  list-style: none;
  margin-bottom: 10px;
`;

const StyledLink = styled(Link)`
  color: blue;
  text-decoration: none;
  font-size: 16px;
  &:hover {
    color: lightblue;
  }
`;

export default function RoomList(props: RoomListProps) {
  return (
    <RoomListS>
      {props.rooms
        .map((room: any) => (
          <RoomS key={generateUniqueId()}>
           <StyledLink to={`/chat/${room.id}`}>
            {room.name}
          </StyledLink>
          </RoomS>
        ))}
    </RoomListS>
  )
}

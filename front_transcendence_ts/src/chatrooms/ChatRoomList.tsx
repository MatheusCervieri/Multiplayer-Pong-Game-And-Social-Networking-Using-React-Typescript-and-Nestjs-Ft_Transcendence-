import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {Room} from './ChatInterface';
import io, {Socket} from "socket.io-client";
import Createroomaux from './Createroomaux';
import RoomList from './RoomList';
import DmList from './DmList';
import CreateDmAux from './CreateDmAux';
import axios from 'axios';
import instance from '../confs/axios_information';
import { serverurl } from '../confs/axios_information';
import Blockuser from './Blockuser';
import { Container, StyledButton, BtnContainer, StyledButton2, StyledButton3 } from './Styles/ChatRoomList.style';


interface NewRoomProps {
  newRoomName: string;
  setNewRoomName: (newRoomName: string) => void;
  handleCreateRoom: (data: any) => void;
  getRooms: () => void;
  btnRooms: () => void;
  rooms: Room[];
  socket: Socket | undefined;
  dms: Room[];
  setDms : (dms: Room[]) => void;
  username: string;
}

const ChatRoomList = (props: NewRoomProps) => {
  const [showForm, setShowForm] = useState(false);
  const [newDmCompoment, setNewDmCompoment] = useState(false);
  const [roomDm, setRoomDm] = useState(false);
  const [selected, setSelected] = useState('Rooms');

  function handleCreateRoom(data: any) {
    setShowForm(!showForm);
    props.handleCreateRoom(data); //Aqui eu preciso passar as informações para criar a salaa. 
    props.setNewRoomName('');
  }


  function handleNewDm(){
    setNewDmCompoment(!newDmCompoment);
  }

  function handleRoomBtn(){
    setSelected('Rooms');
    setRoomDm(false);
    props.btnRooms();
  }

  function encodeUsername(username : string) {
    return encodeURIComponent(username);
}
    
  async function loadDms()
  {
  
  axios.get(serverurl + '/chatdata/get-dms2/' + encodeUsername(props.username))
  .then(response => {
    // handle success
    
    props.setDms(response.data);
    })
  .catch(error => {
    // handle error
    
    return null;
  });
  }

  function handleDmBtn(){
    setSelected('Direct Message');
    loadDms();
    setRoomDm(true);
  }

  return (
    <Container>
      {showForm && !roomDm && <Createroomaux handleCreateRoom={handleCreateRoom} />}
      {newDmCompoment && roomDm && <CreateDmAux username={props.username} setDms={props.setDms} dms={props.dms} />}
      {roomDm && <StyledButton onClick={handleNewDm}>+</StyledButton>}
      {!roomDm && <StyledButton onClick={handleCreateRoom}>+</StyledButton>}
      <BtnContainer>
      <StyledButton2 selected={selected} onClick={handleRoomBtn}>Rooms</StyledButton2>
      <StyledButton3 selected={selected} onClick={handleDmBtn}>Direct Messages</StyledButton3>
      </BtnContainer>
      {!roomDm && <RoomList rooms={props.rooms} />}
      {roomDm && <DmList username={props.username} dms={props.dms} />}
    </Container>
  );
};

export default ChatRoomList;
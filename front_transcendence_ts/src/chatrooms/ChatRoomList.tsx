import React, { useState } from 'react';
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

  function handleCreateRoom(data: any) {
    setShowForm(!showForm);
    props.handleCreateRoom(data); //Aqui eu preciso passar as informações para criar a salaa. 
    props.setNewRoomName('');
  }

  function handleNewDm(){
    setNewDmCompoment(!newDmCompoment);
  }

  function handleRoomBtn(){
    setRoomDm(false);
    props.btnRooms();
  }

  function encodeUsername(username : string) {
    return encodeURIComponent(username);
}
    
  async function loadDms()
  {
  console.log("Load dms", props.username);
  axios.get(serverurl + '/chatdata/get-dms2/' + encodeUsername(props.username))
  .then(response => {
    // handle success
    console.log(response.data);
    props.setDms(response.data);
    })
  .catch(error => {
    // handle error
    console.log(error);
    return null;
  });
  }

  function handleDmBtn(){
    loadDms();
    setRoomDm(true);
  }

  return (
    <div>
      <h3>Chat:</h3>
      {showForm && !roomDm && <Createroomaux handleCreateRoom={handleCreateRoom}/>}
      {newDmCompoment && roomDm && <CreateDmAux username={props.username} setDms={props.setDms} dms={props.dms}/>}
      {roomDm && <button onClick={handleNewDm}>New DM</button>}
      {!roomDm && <button onClick={handleCreateRoom}>Create Room</button>}
      <button onClick={handleRoomBtn}>Rooms</button>
      <button onClick={handleDmBtn}>Direct Messages</button>
      {!roomDm && <RoomList rooms={props.rooms}/>}
      {roomDm && <DmList username={props.username} dms={props.dms}/>}
    </div>
  );
};

export default ChatRoomList;
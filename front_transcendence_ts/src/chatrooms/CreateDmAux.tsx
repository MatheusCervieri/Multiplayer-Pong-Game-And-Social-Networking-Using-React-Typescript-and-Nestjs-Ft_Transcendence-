import React from 'react'
import UserSearch from '../utils/components/Usersearch'
import { Room } from './ChatInterface';
import axios from 'axios';
import instance from '../confs/axios_information';
import { serverurl } from '../confs/axios_information';



interface CreateDmAuxProps {
    dms: Room[];
    username: string; 
}

/*export interface Room {
    id: number;
    name: string;
    adm: string; 
    type: string;
    password: string;
}*/

export default function CreateDmAux(props: CreateDmAuxProps) {

    async function PostNewRoom(userdm: string): Promise<number>{
        try {
        const data = {
            name: userdm + props.username,
            adm: props.username,
            type: 'dm',
            password: '',
        }
        const response = await instance.post('chatdata/create-room', data );
        PostRoomUser(response.data.id, props.username);
        PostRoomUser(response.data.id, userdm);
        console.log(response.data);
        return 0;
        } catch (error) {
        console.log(error);
        return 1;
        }
    }
    
    async function PostRoomUser(roomid: number, username: string)
    { try {
      const response = await axios.post(serverurl + `/chatdata/add-user-room/${roomid}`, {
        name: username
      });
      return response.data;
    } catch (error) {
      console.error(error);
    } }
    
    function handleUser(user: any) {
        //Criar o novo room.
        //Adicionar os dois usuários. 
    }

  return (
    <UserSearch btnName='Start DM!' handleUser={handleUser}/>
  )
}

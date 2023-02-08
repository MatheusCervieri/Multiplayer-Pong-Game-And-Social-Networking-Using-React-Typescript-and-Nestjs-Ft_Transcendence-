import React from 'react'
import UserSearch from '../utils/components/Usersearch'
import { Room } from './ChatInterface';
import axios from 'axios';
import instance from '../confs/axios_information';
import { serverurl } from '../confs/axios_information';
import { useNavigate } from 'react-router-dom';



interface CreateDmAuxProps {
    dms: Room[];
    username: string; 
    setDms : (dms: Room[]) => void;
}

/*export interface Room {
    id: number;
    name: string;
    adm: string; 
    type: string;
    password: string;
}*/

function encodeUsername(username : string) {
    return encodeURIComponent(username);
}


export default function CreateDmAux(props: CreateDmAuxProps) {
    const navigate = useNavigate();

async function loadDms()
{
    axios.get(serverurl + '/chatdata/get-dms2/' + encodeUsername(props.username))
    .then(response => {
      // handle success
      props.setDms(response.data);
      })
    .catch(error => {
      // handle error
      console.log(error);
      return null;
    });
}

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
        console.log("Room User Name", username);
      const response = await axios.post(serverurl + `/chatdata/add-user-room/${roomid}`, {
        name: username
      });
      return response.data;
    } catch (error) {
      console.error(error);
    } }

    function findObjectsWithMatchingUserName(arrayOfObjects : any[], searchString: string) {
        return arrayOfObjects.filter(obj => {
          return obj.users.some((user: { name: string; }) => user.name === searchString);
        });
    }
    function findDMWithUser(arrayOfRooms: { type: string; users: any[]}[], userName: string): any | undefined {
        return arrayOfRooms.find(room => room.type === 'dm' && room.users.some(user => user.name === userName));
      }
    
    function handleUser(user: any) {
        loadDms().then(() => {
            const objects = findObjectsWithMatchingUserName(props.dms, user).length > 0;
            if (objects)
            {
                const dmuser = findObjectsWithMatchingUserName(props.dms, user)
                navigate('/chat/' + dmuser[0].id);
            }
            else
                PostNewRoom(user);
        });
       
    }
    function showdms(){
        loadDms();
       
    }

  return (
    <div>
    <UserSearch btnName='Start DM!' handleUser={handleUser}/>
    <button onClick={showdms}>Load Dms</button>
    </div>
  )
}

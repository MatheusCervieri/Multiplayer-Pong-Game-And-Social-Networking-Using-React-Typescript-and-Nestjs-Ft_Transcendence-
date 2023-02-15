import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom';
import instance from '../confs/axios_information';
import { useState } from 'react';
import Useradmin from './Useradmin';

export interface ChatRoomDto {
  id: number;
  name: string;
  adm: string;
  type: string;
  password: string;
  users: any[];
  adminusers: any[];
  owner: any;
}

interface RoominfoProps {
  username: string; 
}


export default function Roominfo(props: RoominfoProps) {
    const { id } = useParams<{ id: string | undefined }>();
    const [information, setInformation] = useState<any>();
    const [showInfo, setShowInfo] = useState<boolean>(false);


   
    
    async function handleClick() {
        const token = localStorage.getItem('token');
        try {
            const response = await instance.get('room/room-user-info/' + id, 
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
            setInformation(response.data);
            console.log(information);
            setShowInfo(!showInfo);
            return 0;
            } catch (error) {
            console.log(error);
            setShowInfo(!showInfo);
            return 1;
            }
    };
  

    return (
    <div>
        {showInfo && <Useradmin username={props.username} information={information}/>}
        <button onClick={handleClick}>Information</button>
    </div>
  )
}

import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom';
import instance from '../confs/axios_information';
import { useState } from 'react';
import Useradmin from './Useradmin';
import styled from 'styled-components';

const RoomImfoButton = styled.button`
  background-color: #ff8800;
  color: #fff;
  font-size: 14px;
  padding: 10px 20px;
  border-radius: 5px;
  border: none;
  cursor: pointer;
  width: fit-content;
  margin: 10px;
  &:hover {
    background-color: #ff7300;
  }
`;

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
  setShowInfo: React.Dispatch<React.SetStateAction<boolean>>;
  showInfo: boolean;
  UserInformation: any;
  setUserInformation: React.Dispatch<React.SetStateAction<any>>;
}




export default function Roominfo(props: RoominfoProps) {
    const { id } = useParams<{ id: string | undefined }>();
    


   
    
    async function handleClick() {
        const token = localStorage.getItem('token');
        try {
            const response = await instance.get('room/room-user-info/' + id, 
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
            props.setUserInformation(response.data);
            console.log(props.UserInformation);
            props.setShowInfo(!props.showInfo);
            return 0;
            } catch (error) {
            console.log(error);
            props.setShowInfo(!props.showInfo);
            return 1;
            }
    };
  

    return (
    <div>
        
        <RoomImfoButton onClick={handleClick}>Information</RoomImfoButton>
    </div>
  )
}

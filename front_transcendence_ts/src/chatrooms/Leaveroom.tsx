import React from 'react'
import instance from '../confs/axios_information';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import styled from "styled-components";

const LeaveRoomButton = styled.button`
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

export default function Leaveroom() {
    const { id } = useParams<{ id: string | undefined }>();
    const navigate = useNavigate();

    async function handleClick() 
    {
    

            const token = localStorage.getItem('token');
            const data = {teste: "teste"};
            try {
                const response = await instance.post('room/leave-room/' + id, data, 
            {
            headers: {
                'Authorization': `Bearer ${token}`
            }
            });
                console.log(response.data);
                navigate('/chat');
                return 0;
                } catch (error) {
                console.log(error);
                navigate('/chat');
                return 1;
            }
    }

  return (
    <LeaveRoomButton onClick={handleClick}>Leave room</LeaveRoomButton>
  )
}

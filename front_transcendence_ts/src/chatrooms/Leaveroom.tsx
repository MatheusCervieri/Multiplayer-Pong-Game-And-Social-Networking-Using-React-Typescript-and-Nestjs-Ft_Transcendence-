import React from 'react'
import instance from '../confs/axios_information';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

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
    <button onClick={handleClick}>Leave room</button>
  )
}

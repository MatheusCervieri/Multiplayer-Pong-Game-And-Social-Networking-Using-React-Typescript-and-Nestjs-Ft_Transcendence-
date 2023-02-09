import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios';
import { serverurl } from '../confs/axios_information';
import { useEffect } from 'react';

export default function Profile() {
  const { name } = useParams<{ name: string }>();
  const [username, setUsername] = useState<string>('');

  async function getUserInformation(){
    console.log(name);
    const token = localStorage.getItem('token');
    axios.get(serverurl + '/userdata/profile/' + name,{
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
    .then((response) => {
      console.log(response.data);
      setUsername(response.data.name);
    })
    .catch((error) => {
      console.log(error);
    });
  }

  useEffect(() => {
    getUserInformation();
  }, []);

    return (
    <div>Profile {username}</div>
  )
}

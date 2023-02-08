import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios';
import { serverurl } from '../confs/axios_information';
import { useEffect } from 'react';

export default function Profile() {
  const { name } = useParams<{ name: string }>();
  const [username, setUsername] = useState<string>('');

  async function getUserInformation(){
    axios.get(serverurl + '/userdata/profile/' + name)
    .then((response) => {
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

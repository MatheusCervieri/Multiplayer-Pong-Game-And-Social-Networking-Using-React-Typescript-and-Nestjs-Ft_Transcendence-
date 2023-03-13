import React, { useEffect, useState } from 'react';
import axios from 'axios';
import instance from '../../confs/axios_information';
import { useLocation, useNavigate } from 'react-router-dom';

export default function SendTwoFaCode() {
  const [code, setCode] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const name = searchParams.get('name');

  
  const handleSubmit = async (event: any) => {
    event.preventDefault();
   
    try {
      const data = 
      {
        name: name,
        code : code,
      }
      const response = await instance.post('/auth/2fa', data);
      
      
      localStorage.setItem('token', response.data.token);
      navigate('../dashboard');
    } catch (error : any) {
      
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>
          Code:
          <input type="text" value={code} onChange={(event) => setCode(event.target.value)} />
        </label>
        <button type="submit">Send code</button>
      </form>
    </div>
  );
}

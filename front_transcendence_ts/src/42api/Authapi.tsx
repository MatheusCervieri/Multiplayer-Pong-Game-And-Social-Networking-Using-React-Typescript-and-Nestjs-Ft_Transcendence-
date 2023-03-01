import React from 'react'
import  instance from '../confs/axios_information';

export default function Authapi() {

  async function AuthRequest()
  {
    //make a request using axios instance
    try {
      const response = await instance.get("/auth/42");
      console.log(response);
    } catch (error) {
      console.log(error);
    }

  }

  return (
    <div>
      <button onClick={AuthRequest}>Login with 42!</button>
    </div>
  )
}

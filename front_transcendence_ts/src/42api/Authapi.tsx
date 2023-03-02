import React from 'react'
import  instance from '../confs/axios_information';
import {serverurl} from '../confs/axios_information';

export default function Authapi() {

  async function AuthRequest()
  {
    //make a request using axios instance
    window.location.href = serverurl + '/auth/42';

  }

  return (
    <div>
      <button onClick={AuthRequest}>Login with 42!</button>
    </div>
  )
}

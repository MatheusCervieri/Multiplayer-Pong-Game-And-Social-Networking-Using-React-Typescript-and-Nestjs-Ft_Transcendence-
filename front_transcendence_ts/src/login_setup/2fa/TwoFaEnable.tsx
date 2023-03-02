import React from 'react'
import  instance from '../../confs/axios_information';

//Checklsit
//Create a endpoint to enable to factor authentication
//When the user login check if the user has 2fa enabled, if it has enable redirect the user to the page to enter the code
//Create an endpoint that accepts the code and checks if it matches the code stored in the database for the user. If it does, return a JWT token. If it doesn't, return an error.


export default function TwoFa() {
  async function enable2FA()
  {
    const token = localStorage.getItem('token');

    try {
      const response = await instance.get('/userdata/enable-2fa',   {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  }
  async function disable2FA()
  {
    const token = localStorage.getItem('token');
    const data = "empty";
    try {
      const response = await instance.get('userdata/disable-2fa', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <>
    <button onClick={enable2FA}>Enable 2fa</button>
    <button onClick={disable2FA}>Disable 2fa</button>
    </>
  )
}

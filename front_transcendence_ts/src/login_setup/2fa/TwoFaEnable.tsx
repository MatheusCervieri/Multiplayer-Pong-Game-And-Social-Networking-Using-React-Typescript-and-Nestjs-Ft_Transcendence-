import React, { useEffect } from 'react'
import { toast } from 'react-toastify';
import  instance from '../../confs/axios_information';

//Checklsit
//Create a endpoint to enable to factor authentication
//When the user login check if the user has 2fa enabled, if it has enable redirect the user to the page to enter the code
//Create an endpoint that accepts the code and checks if it matches the code stored in the database for the user. If it does, return a JWT token. If it doesn't, return an error.


export default function TwoFa() {
  const [TwoFaStatus, setTwoFaStatus] = React.useState(false);

  async function enable2FA(event: any)
  {
    const token = localStorage.getItem('token');
    event.preventDefault(); // prevent the default form submission

    const email = event.target.elements.email.value;
    console.log(email);
    try {
      const response = await instance.post('/userdata/enable-2fa', {email},  {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      console.log(response.data);
  
      console.log(response.data.status);
      if (response.data.status === 400) {
        toast.error(response.data.message)
      } 
      else
        toast.success("2fa enabled");
        GetTwoFaStatus();
    } catch (error : any) {
      console.error(error);
      //toast.error(error.message);
  }
  }
  async function disable2FA()
  {
    const token = localStorage.getItem('token');
    try {
      const response = await instance.get('userdata/disable-2fa', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      console.log(response.data);
      toast.success("2fa disabled");
      GetTwoFaStatus();
    } catch (error) {
      console.error(error);
    }
  }

  async function GetTwoFaStatus()
  {
    const token = localStorage.getItem('token');
    try {
      const response = await instance.get('userdata/2fastatus', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setTwoFaStatus(response.data);
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    GetTwoFaStatus();
  }, []);

  return (
    <>
    {TwoFaStatus ? <h1>2fa enabled</h1> : <h1>2fa disabled</h1>}
    {!TwoFaStatus &&
    <form onSubmit={enable2FA}>
      <label htmlFor="email">Email:</label>
      <input type="email" id="email" name="email" required />

      <button type="submit">Enable 2fa</button>
    </form>
    }
    {TwoFaStatus && <button onClick={disable2FA}>Disable 2fa</button>}
    </>
  )
}

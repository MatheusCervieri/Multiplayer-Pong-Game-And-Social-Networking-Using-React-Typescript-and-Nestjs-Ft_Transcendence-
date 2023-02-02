import { useNavigate } from 'react-router-dom';
import instance  from '../confs/axios_information';

   export default async function GetToken(navigate: any, setUsername: any) {
    const token = localStorage.getItem('token');
    console.log(token);
    if (!token) {
      navigate('../login');
    } else {
      LoadUserInformation(token, setUsername);
    }
  }

  async function fetchData(token: string) {
    const response = await instance.get('userdata', {
        headers: {
          Authorization: `Bearer ${token}`
        }});
    return response.data;
  }

  const LoadUserInformation = (token: string, setUsername: any) => {
        fetchData(token)
        .then(data => {
            console.log("Token information: " , data);
            setUsername(data.name);
        })
        .catch(error => {
            console.error(error);
        });
    }
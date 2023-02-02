import { useNavigate } from 'react-router-dom';
import instance  from '../confs/axios_information';

export default async function GetToken(navigate: any) : Promise<{name: string, email:string} | undefined> {
    const token = localStorage.getItem('token');
    console.log(token);
    if (!token) {
      navigate('../login');
      return Promise.resolve(undefined);
    } else {
      return LoadUserInformation(token);
    }
}

  async function fetchData(token: string) {
    const response = await instance.get('userdata', {
        headers: {
          Authorization: `Bearer ${token}`
        }});
    return response.data;
  }

  async function LoadUserInformation(token: string) : Promise<{name: string, email:string} | undefined | any>{
        fetchData(token)
        .then(data => {
            console.log(data);
            return data;
        })
        .catch(error => {
            console.error(error);
            return undefined;
        });
    }

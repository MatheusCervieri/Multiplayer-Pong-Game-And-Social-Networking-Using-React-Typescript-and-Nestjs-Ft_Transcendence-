import { useNavigate } from 'react-router-dom';
import instance  from '../confs/axios_information';

   export default async function GetUserData(navigate: any) {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('../login');
    } else {
        const response = await instance.get('userdata', {
            headers: {
              Authorization: `Bearer ${token}`
            }});
        return response.data;
    }
  }

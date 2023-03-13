import serverurl from '../confs/axios_information';
import axios from 'axios';

export async function getReq(url: string) : Promise<any>
{
    const token = localStorage.getItem('token');
    axios.get(serverurl + url, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
        .then((response) => {
            return response;
        })
        .catch((error) => {
          
          return null; 
        });
}

export async function postReq(url: string, data: any) : Promise<any> {
    const token = localStorage.getItem('token');
    axios.post(serverurl + url, data, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
        .then((response) => {
            
            return response.data;
        })
        .catch((error) => {
          
          return Promise.reject(error); 
        });
}
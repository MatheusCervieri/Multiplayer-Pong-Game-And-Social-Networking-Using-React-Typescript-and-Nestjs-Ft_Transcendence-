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
          console.log(error);
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
            console.log("Teste", response.data);
            return response.data;
        })
        .catch((error) => {
          console.log(error);
          return Promise.reject(error); 
        });
}
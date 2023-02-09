import React from 'react'
import instance from '../confs/axios_information';

interface BlockuserProps {
    blockeduser : string;
}


export default function Blockuser(props : BlockuserProps) {
    function handleBlockBtn(){
        const token = localStorage.getItem('token');
        instance.post('/userdata/block', {
            userToBlockName: props.blockeduser
        }, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
          .then(response => {
            console.log(response.data);
          })
          .catch(error => {
            console.error(error);
          });
        }

        function handleGetBlockkBtn(){
            const token = localStorage.getItem('token');
            instance.get('/userdata/blocked-users', {
              headers: {
                'Authorization': `Bearer ${token}`
              }
            })
              .then(response => {
                console.log(response.data);
              })
              .catch(error => {
                console.error(error);
              });
            }

  return (
    <>
    <div><button onClick={handleBlockBtn}>Block User</button></div>
    <div><button onClick={handleGetBlockkBtn}>Get Block</button></div>
    </>
  )
}

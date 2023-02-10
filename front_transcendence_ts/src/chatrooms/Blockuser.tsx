import React, { useEffect } from 'react'
import instance from '../confs/axios_information';
import { OptionButton } from './UserOptions';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

interface BlockuserProps {
    blockeduser : string;
    setBlockedUsers : (blockedUsers : string[]) => void;
}


export default function Blockuser(props : BlockuserProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [url, setUrl] = React.useState('');

  useEffect(() => {
    setUrl(location.pathname);
  }, []);

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
            navigate(url);
            //GetBlocked();
            console.log(response.data);
          })
          .catch(error => {
            console.error(error);
          });
        }

        async function GetBlocked(){
            const token = localStorage.getItem('token');
            instance.get('/userdata/blocked-users', {
              headers: {
                'Authorization': `Bearer ${token}`
              }
            })
              .then(response => {
                console.log("UHULLLLL");
                props.setBlockedUsers(response.data);
                console.log(response.data);
              })
              .catch(error => {
                console.error(error);
              });
            }

  return (
    <>
    <div><OptionButton onClick={handleBlockBtn}>Block User</OptionButton></div>
    </>
  )
}

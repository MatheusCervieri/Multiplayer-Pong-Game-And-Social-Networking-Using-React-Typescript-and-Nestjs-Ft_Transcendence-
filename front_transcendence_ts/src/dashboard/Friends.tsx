import React, { useState, useEffect } from 'react';
import  instance, { serverurl } from '../confs/axios_information';
import { toast } from "react-toastify";

interface UserProps {
  socket : any;
}


const Friends = (props : UserProps) => {
  const [users, setUsers] = useState<any[]>([]);


  function getUserInformation()
  {
    const token = localStorage.getItem('token');
    instance.get('userdata/friends' , {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
    .then(response => {
      console.log(response.data);
      setUsers(response.data);
    })
    .catch(error => {
      console.error(error);
    });
  }
  useEffect(() => {
    getUserInformation();
  }, []);

  //socket.emit('authenticate', { token: token , game_id: id});
  /*

  */

  return (
    <div>
      <h2>Friends</h2>
      <ul>
        {users.map((user) => (
          <li key={user.id}>{user.name} {user.status} 
          <img src={serverurl + "/publicimage/profileimage/" + user.id } alt="Profile" width="50" height="50" />
          <button onClick={  () => {
            console.log(user.name);
            const token = localStorage.getItem('token');
              const data = { token: token, playerToPlayName : user.name}
              props.socket.emit('invite-game', data);
            }}>Invite to Play</button>
            </li>
        ))}
      </ul>
    </div>
  );
};

export default Friends;
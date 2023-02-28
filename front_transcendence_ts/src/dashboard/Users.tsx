import React, { useState, useEffect } from 'react';
import  instance from '../confs/axios_information';

interface UserProps {
  socket : any;
}


const Users = (props : UserProps) => {
  const [users, setUsers] = useState<any[]>([]);


  function getUserInformation()
  {
    const token = localStorage.getItem('token');
    instance.get('userdata/userstatus' , {
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

  function teste(data : any)
  {

  }
  /*

  */

  return (
    <div>
      <h2>Users</h2>
      <ul>
        {users.map((user) => (
          <li key={user.id}>{user.name} {user.status} <button onClick={  () => {
            console.log(user.name);
            const token = localStorage.getItem('token');
              const data = { token: token, playerToPlayName : user.name}
              props.socket.emit('invite-game', data);
            }}>Invite to Play</button></li>
        ))}
      </ul>
    </div>
  );
};

export default Users;
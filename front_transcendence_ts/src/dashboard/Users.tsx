import React, { useState, useEffect } from 'react';
import  instance, { serverurl } from '../confs/axios_information';
import { toast } from "react-toastify";

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

  function addAsFriend(name : any)
  {
    const token = localStorage.getItem('token');
    const data = { userToAddName : name}
    instance.post('userdata/addfriend' , data,  {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
    .then(response => {
      console.log(response.data);
      toast.success("Friend added!");
    })
    .catch(error => {
      console.error(error);
    });
  }

  function Block(name : any)
  {
    const token = localStorage.getItem('token');
    const data = { userToBlockName : name}
    instance.post('userdata/block' , data,  {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
    .then(response => {
      console.log(response.data);
      toast.success("User blocked");
    })
    .catch(error => {
      console.error(error);
    });
  }
  /*

  */

  return (
    <div>
      <h2>Users</h2>
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
            <button onClick={  () => {
              addAsFriend(user.name);
            }}>Add as Friend!</button>
            <button onClick={  () => {
              Block(user.name);
            }}>Block</button>
            </li>
        ))}
      </ul>
    </div>
  );
};

export default Users;
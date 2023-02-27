import React, { useState, useEffect } from 'react';
import  instance from '../confs/axios_information';

interface User {
  id: number;
  name: string;
}

const initialUsers: User[] = [
  { id: 1, name: 'Alice' },
  { id: 2, name: 'Bob' },
  { id: 3, name: 'Charlie' },
];

const Users: React.FC = () => {
  const [users, setUsers] = useState<User[]>(initialUsers);


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
      //setUsers(response.data);
    })
    .catch(error => {
      console.error(error);
    });
  }
  useEffect(() => {
    getUserInformation();
  }, []);

  return (
    <div>
      <h2>Users</h2>
      <ul>
        {users.map((user) => (
          <li key={user.id}>{user.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default Users;
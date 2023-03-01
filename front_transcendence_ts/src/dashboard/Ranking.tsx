import React, { useState, useEffect } from 'react';
import  instance from '../confs/axios_information';



const Ranking = () => {
  const [users, setUsers] = useState<any[]>([]);


  function getUserInformation()
  {
    const token = localStorage.getItem('token');
    instance.get('userdata/usersranking' , {
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



  return (
    <div>
      <h2>Users</h2>
      <ul>
        {users.map((user) => (
          <li key={user.id}>{user.name} {user.status} RankingP:{user.rankingP} Wins:{user.wins} Losts:{user.losts}</li>
        ))}
      </ul>
    </div>
  );
};

export default Ranking;
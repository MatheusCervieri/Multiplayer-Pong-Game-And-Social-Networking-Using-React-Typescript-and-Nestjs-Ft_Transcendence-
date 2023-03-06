import axios from 'axios';
import React, { useEffect, useState } from 'react';
import  instance, { serverurl } from '../../confs/axios_information';

const MyPerfil: React.FC = () => {
  const [userInformation, setUserInformation] = useState<any>([]);
  const [matchHistory, setMatchHistory] = useState<any[]>([]);

  function getUserInformation()
  {
    const token = localStorage.getItem('token');
    instance.get('userdata/myprofile' , {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
    .then((response: any) => {
      console.log(response.data);
      console.log(response.data.id);
      setUserInformation(response.data);
      getMatchHistory(response.data.name);
    })
    .catch((error : any) => {
      console.error(error);
    });
  }
  useEffect(() => {
    getUserInformation();
  }, []);

  async function getMatchHistory(name : string){
    const token = localStorage.getItem('token');
    axios.get(serverurl + '/games/history/' + name,{
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
    .then((response : any) => {
      console.log(response.data);
      setMatchHistory(response.data);
    })
    .catch((error : any) => {
      console.log(error);
    });
  }



  const handlePictureEdit = () => {
    // Handle picture edit here
  };

  const handleNameEdit = () => {
    // Handle name edit here
  };
  
 
    

  return (
    <div>
      <div>
        <img src={serverurl + "/publicimage/profileimage/" + userInformation.id} alt="Player" width={100} height={100}/>
        <button onClick={handlePictureEdit}>Edit Picture</button>
      </div>
      <div>
        <p>{userInformation.name}</p>
        <button onClick={handleNameEdit}>Edit Name</button>
      </div>
      <div>
        <p>Wins: {userInformation.wins}</p>
        <p>Loses: {userInformation.losts}</p>
      </div>
      <div>
        <p>Ranking: {userInformation.rankingP}</p>
      </div>
      <div>
        <p>Match History</p>
        <ul>
        {matchHistory.map((match, index) => (
          <li key={index}>
            Match Name: {match.name}, Winner: {match.winnerName}
          </li>
        ))}
    </ul>
      </div>
    </div>
  );
};

export default MyPerfil;
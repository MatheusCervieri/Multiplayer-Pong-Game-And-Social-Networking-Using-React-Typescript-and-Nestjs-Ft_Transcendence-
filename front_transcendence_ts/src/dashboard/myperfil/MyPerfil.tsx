import axios from 'axios';
import React, { useEffect, useState } from 'react';
import  instance, { serverurl } from '../../confs/axios_information';
import styled from 'styled-components';

const UserInfoWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ProfileImage = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  margin-bottom: 16px;
`;

const EditButton = styled.button`
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
  padding: 8px 16px;
  margin-left: 8px;
  cursor: pointer;
`;

const UserName = styled.p`
  font-size: 24px;
  font-weight: bold;
`;

const UserInfoItem = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 0;
`;

const UserInfoLabel = styled.p`
  font-size: 18px;
  font-weight: bold;
  margin-right: 16px;
`;

const MatchHistoryWrapper = styled.div`
  margin-top: -16px;
  background-color: #f2f2f2;
  padding: 16px;
  border-radius: 4px;
  text-align: center;
`;

const MatchHistoryTitle = styled.p`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 16px;
`;

const MatchHistoryList = styled.ul`
  list-style: none;
  padding: 0;
`;

const MatchHistoryItem = styled.li`
    font-size: 18px;
    margin-bottom: 8px;
    border: 2px solid #ccc;
    border-radius: 4px;
    padding: 8px;

    &.winner {
    border-color: green;
    }

    &.loser {
      border-color: red;
    }

`;

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
    <UserInfoWrapper>
      <ProfileImage src={serverurl + "/publicimage/profileimage/" + userInformation.id} alt="Player" />
      <EditButton onClick={handlePictureEdit}>Edit Picture</EditButton>
      <UserName>{userInformation.name}</UserName>
      <EditButton onClick={handleNameEdit}>Edit Name</EditButton>
      <UserInfoItem>
        <UserInfoLabel>Wins:</UserInfoLabel>
        <p>{userInformation.wins}</p>
      </UserInfoItem>
      <UserInfoItem>
        <UserInfoLabel>Loses:</UserInfoLabel>
        <p>{userInformation.losts}</p>
      </UserInfoItem>
      <UserInfoItem>
        <UserInfoLabel>Ranking:</UserInfoLabel>
        <p>{userInformation.rankingP}</p>
      </UserInfoItem>
      <MatchHistoryWrapper>
        <MatchHistoryTitle>Match History</MatchHistoryTitle>
        <MatchHistoryList>
        {matchHistory.map((match, index) => {
        if (match.winnerId === userInformation.id) {
          return (
            <MatchHistoryItem key={index} className="winner">
              {match.name}, Winner: {match.winnerName}
            </MatchHistoryItem>
          );
        } else if (match.looserId === userInformation.id) {
          return (
            <MatchHistoryItem key={index} className="loser">
             {match.name}, Loser: {userInformation.name}
            </MatchHistoryItem>
          );
        } else {
          return (
            <MatchHistoryItem key={index}>
              {match.name}
            </MatchHistoryItem>
          );
        }
      })}
        </MatchHistoryList>
      </MatchHistoryWrapper>
    </UserInfoWrapper>
  );
};

export default MyPerfil;
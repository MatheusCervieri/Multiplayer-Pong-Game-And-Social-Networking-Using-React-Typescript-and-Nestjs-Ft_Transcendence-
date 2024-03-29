import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios';
import { serverurl } from '../confs/axios_information';
import { useEffect } from 'react';
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


export default function Profile() {
  const { name } = useParams<{ name: string }>();
  const [userInformation, setUserInformation] = useState<any>([]);
  const [matchHistory, setMatchHistory] = useState<any[]>([]);

  async function getUserInformation(){
    
    const token = localStorage.getItem('token');
    axios.get(serverurl + '/userdata/profile/' + name,{
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
    .then((response) => {
      
      setUserInformation(response.data);
      getMatchHistory();
    })
    .catch((error) => {
      
    });
  }
  
  async function getMatchHistory(){
    const token = localStorage.getItem('token');
    axios.get(serverurl + '/games/history/' + name,{
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
    .then((response) => {
      
      setMatchHistory(response.data);
    }) 
    .catch((error) => {
      
    });
  }


  useEffect(() => {
    getUserInformation();
    getMatchHistory();
  }, []);

  return (
    <UserInfoWrapper>
      <ProfileImage src={serverurl + "/publicimage/profileimage/" + userInformation.id} alt="Player" />
      <UserName>{userInformation.name}</UserName>
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
        const [player1Name, player2Name] = match.name.split(" vs ");
        if (match.winnerId === userInformation.id) {
          return (
            <MatchHistoryItem key={index} className="winner">
               {player1Name} ({match.player1FinalScore}) vs {player2Name} ({match.player2FinalScore})
            </MatchHistoryItem>
          );
        } else if (match.looserId === userInformation.id) {
          return (
            <MatchHistoryItem key={index} className="loser">
              {player1Name} ({match.player1FinalScore}) vs {player2Name} ({match.player2FinalScore})
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
}

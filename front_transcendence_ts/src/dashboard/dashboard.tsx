import React, { useState } from 'react';
import instance from '../confs/axios_information';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 10px;
`;

const Title = styled.p`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
`;

const Button = styled.button`
  background-color: #00b8d9;
  color: white;
  border: none;
  padding: 10px 20px;
  margin: 10px;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;

  &:hover {
    background-color: #0066a0;
  }
`;

const Dashboard = () => {
    const [username, setUsername] = useState("");
    const navigate = useNavigate();
    const user_information: {name: string, email: string} = {name: '', email: ''}; 
    
    const handleLogout = () => {
      localStorage.removeItem('token');
      navigate('../');
      // Add other logout logic here, such as clearing session data, etc.
    };

    useEffect(() => {
        checkToken();
    })
  
    async function checkToken() {
      const token = localStorage.getItem('token');
      
      if (!token) {
        navigate('../');
      } else {
        LoadUserInformation(token);
      }
    }
  
    async function fetchData(token: string) {
      const response = await instance.get('userdata', {
          headers: {
            Authorization: `Bearer ${token}`
          }});
      return response.data;
    }
  
    const LoadUserInformation = (token: string) => {
          fetchData(token)
          .then(data => {
              
              user_information.name = data.name;
              user_information.email = data.email;
              setUsername(user_information.name);
          })
          .catch(error => {
              console.error(error);
          });
      }
  function findGame() {
    navigate('../findgame');
  }
  function watchGame() {
    navigate('../watchgame');
  }

  return (
    <Container>
      <Title>Welcome, {username}!</Title>
      <div>
        <Button onClick={findGame}>Find a Game</Button>
        <Button onClick={watchGame}>Watch a Game</Button>
        <Button onClick={() => {navigate('/chat')}}>Chat</Button>
        <Button onClick={() => {navigate('/ranking')}}>Ranking</Button>
        <Button onClick={() => {navigate('/myperfil')}}>My Profile</Button>
        <Button onClick={handleLogout}>Log Out</Button>
      </div>
    </Container>
  );
  };
  
  export default Dashboard;
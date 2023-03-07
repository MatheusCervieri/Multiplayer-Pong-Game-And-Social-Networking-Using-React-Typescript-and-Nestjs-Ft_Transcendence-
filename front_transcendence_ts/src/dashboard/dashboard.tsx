import React, { useState } from 'react';
import instance from '../confs/axios_information';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const Dashboard = () => {
    const [username, setUsername] = useState("John Doe");
    const navigate = useNavigate();
    let user_information: {name: string, email: string} = {name: '', email: ''}; 
    
    const handleLogout = () => {
      localStorage.removeItem('token');
      navigate('../login');
      // Add other logout logic here, such as clearing session data, etc.
    };

    useEffect(() => {
        checkToken();
    })
  
    async function checkToken() {
      const token = localStorage.getItem('token');
      console.log(token);
      if (!token) {
        navigate('../login');
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
              console.log(data);
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
      <div>
        <p>Welcome, {username}!</p>
        <button onClick={findGame}>Find a Game!</button>
        <button onClick={watchGame}>Watch a Game!</button>
        <button onClick={() => {navigate('/chat')}}>Chat!</button>
        <button onClick={() => {navigate('/ranking')}}>Ranking!</button>
        <button onClick={() => {navigate('/myprofile')}}>My Profile!</button>
        <button onClick={handleLogout}>Log Out</button>
      </div>
    );
  };
  
  export default Dashboard;
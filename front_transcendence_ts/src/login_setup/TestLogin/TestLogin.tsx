import axios from 'axios';
import React, { useState } from 'react';
import styled from 'styled-components';
import { serverurl } from '../../confs/axios_information';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';



const TestLoginContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Input = styled.input`
  padding: 10px;
  font-size: 16px;
  border: 1px solid #00b8d9;
  border-radius: 4px;
  margin-bottom: 10px;
`;

const Button = styled.button`
  padding: 10px 20px;
  font-size: 16px;
  background-color: #00b8d9;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #009fc7;
  }
`;

const TestLogin: React.FC = () => {
  const [inputValue, setInputValue] = useState('');
  const navigate = useNavigate();

  const handleClick = () => {
    // Handle button click logic here
    postData();
  };

  const postData = async () => {

    const data = {
        name: inputValue,
    }
    try {
      const response = await axios.post(serverurl + '/login/testlogin', data
      );
      
      localStorage.setItem('token', response.data)
      navigate('../dashboard');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <TestLoginContainer>
        <h3>Create a Test User To Use The Game!</h3>
        <Input type="text" value={inputValue} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInputValue(e.target.value)} />
      <Button onClick={handleClick}>Create a Test User!</Button>
    </TestLoginContainer>
  );
};

export default TestLogin;

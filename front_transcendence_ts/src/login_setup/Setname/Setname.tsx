import React, { useState } from 'react';
import styles from '../singup/singup.module.css'
import instance from '../../confs/axios_information';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import styled from 'styled-components';

const FormContainer = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #f2f2f2;
  padding: 24px;
  border-radius: 4px;
  text-align: center;
`;

const FormLabel = styled.label`
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 0px;
`;

const FormInput = styled.input`
  font-size: 18px;
  padding: 8px;
  margin-bottom: 16px;
  border: 2px solid #ccc;
  border-radius: 4px;
  width: 100%;
`;

const FormButton = styled.button`
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
  padding: 8px 16px;
  font-size: 18px;
  cursor: pointer;

  &:hover {
    background-color: #0056b3;
  }
`;

const Setname = () => {
  const [name, setName] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const token = localStorage.getItem('token');
    instance.post('set-name', {
      name: name
    }, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(response => {
        
        if (response.data.status === 400)
        {
          toast.error("Name already taken, choose another one");
        }
        else
          navigate('/setprofileimage');
      })
      .catch(error => {
        console.error(error);
      });
  }

  return (
    <FormContainer onSubmit={handleSubmit}>
     
     <h3>Choose Your Name:</h3>
    <FormLabel>
      
      <FormInput type="name" value={name} onChange={(event) => setName(event.target.value)} />
    </FormLabel>
    <FormButton type="submit">Create Name!</FormButton>
  </FormContainer>
  );
}

export default Setname;
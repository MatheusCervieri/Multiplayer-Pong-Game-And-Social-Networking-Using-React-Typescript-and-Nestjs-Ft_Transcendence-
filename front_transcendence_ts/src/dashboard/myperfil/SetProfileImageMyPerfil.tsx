import React, { useState, ChangeEvent, FormEvent } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import instance from '../../confs/axios_information';
import styled from 'styled-components';

const Container = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 32px;
`;

const Label = styled.label`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 16px;
`;

const Input = styled.input`
  padding: 12px;
  font-size: 18px;
  border: 2px solid #007bff;
  border-radius: 4px;
  margin-bottom: 16px;
`;

const Button = styled.button`
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
  padding: 12px 16px;
  font-size: 18px;
  cursor: pointer;

  &:hover {
    background-color: #0069d9;
  }
`;

const SetProfileImage: React.FC = () => {
  const [image, setImage] = useState<File | null>(null);
  const navigate = useNavigate();

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setImage(event.target.files[0]);
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!image) {
      return;
    }

    const formData = new FormData();
    formData.append('image', image);

    const token = localStorage.getItem('token');

    try {

      const response = await instance.post('/image/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      });

      console.log(response.data);
      if(response.data.statusCode === 200)
      {
        toast.success(response.data.message);
        navigate('/myperfil');
      }
      if(response.data.error.status === 400)
      {
        toast.error(response.data.message);
      }
    } catch (error) {
     
    }
  };

  return (
    <Container onSubmit={handleSubmit}>
      <Label>Choose your profile image:</Label>
      <Input type="file" onChange={handleImageChange} />
      <Button type="submit">Upload Image</Button>
    </Container>
  );
};

export default SetProfileImage;
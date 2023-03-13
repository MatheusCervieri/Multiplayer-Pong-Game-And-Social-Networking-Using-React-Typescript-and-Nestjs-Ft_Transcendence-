import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import styled from "styled-components";
import instance from '../confs/axios_information';

type RoomType = "public" | "protected";

interface SetRoomTypeProps {
    setShowSetRoomType: (show: boolean) => void;
}

const FormContainer = styled.form`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 1em;
  background-color: #f2f2f2;
  border: 1px solid #ddd;
  border-radius: 5px;
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);
`;

const Label = styled.label`
  margin: 0.5em 0;
  font-size: 1em;
  font-weight: 600;
`;

const Select = styled.select`
  margin: 0.5em 0;
  padding: 0.5em;
  border-radius: 5px;
  border: none;
  background-color: #fff;
  font-size: 1em;
  font-weight: 400;
`;

const Input = styled.input`
  margin: 0.5em 0;
  padding: 0.5em;
  border-radius: 5px;
  border: none;
  background-color: #fff;
  font-size: 1em;
  font-weight: 400;
`;

const Button = styled.button`
  margin: 1em 0 0.5em 0;
  padding: 0.5em;
  border-radius: 5px;
  border: none;
  background-color: #5d5dff;
  color: #fff;
  font-size: 1em;
  font-weight: 600;
  text-transform: uppercase;
  cursor: pointer;

  &:hover {
    background-color: #3333ff;
  }
`;

const SetRoomType = (props: SetRoomTypeProps) => {
  const [roomType, setRoomType] = useState<RoomType>("public");
  const [password, setPassword] = useState<string>("");
  const { id } = useParams<{ id: string | undefined }>();

  const handleRoomTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRoomType(e.target.value as RoomType);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = { type: roomType, password: password };
    const token = localStorage.getItem('token');
    try {
        const response = await instance.post('room/change-type/' + id, data, 
    {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
        
        toast.success("Room type changed!");
        props.setShowSetRoomType(false);
        return 0;
        } catch (error) {
        
        props.setShowSetRoomType(false);
        return 1;
        }
  };

  return (
    <>
    <FormContainer onSubmit={handleSubmit}>
      <Label>
        Room Type:
        <Select value={roomType} onChange={handleRoomTypeChange}>
          <option value="public">Public</option>
          <option value="protected">Protected</option>
        </Select>
      </Label>
      {roomType === 'protected' && (
        <Label>
          Password:
          <Input type="password" value={password} onChange={handlePasswordChange} />
        </Label>
      )}
      <Button type="submit">Change Password!</Button>
    </FormContainer>
    <br></br>
    </>
  );
};

export default SetRoomType;

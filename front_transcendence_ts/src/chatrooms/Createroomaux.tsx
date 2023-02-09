import React, { useState } from "react";
import styled from "styled-components";

interface CreateroomauxProps {
    handleCreateRoom: (data: any) => void;
  }

  const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 50px;
`;

const Label = styled.label`
  font-size: 16px;
  margin-bottom: 10px;
`;

const Input = styled.input`
  width: 180px;
  height: 25px;
  margin-bottom: 20px;
  padding: 5px;
  font-size: 14px;
  border-radius: 5px;
  border: 1px solid #ccc;
`;

const InputPassword = styled.input`
  width: 180px;
  height: 25px;
  margin-bottom: 20px;
  padding: 5px;
  font-size: 14px;
  border-radius: 5px;
  border: 1px solid #ccc;
`;

const Select = styled.select`
  width: 180px;
  height: 30px;
  margin-bottom: 20px;
  padding: 5px;
  font-size: 14px;
  border-radius: 5px;
  border: 1px solid #ccc;
`;

const SubmitButton = styled.input`
  width: 200px;
  height: 40px;
  background-color: #007bff;
  color: #fff;
  border-radius: 5px;
  border: none;
  font-size: 20px;
  cursor: pointer;
  &:disabled {
    background-color: #ccc;
  }
`;

const Createroomaux = (props: CreateroomauxProps) => {
  const [roomName, setRoomName] = useState("");
  const [roomType, setRoomType] = useState({ type: "", password: "" });
  const [showPasswordInput, setShowPasswordInput] = useState(false);
  const [formIsValid, setFormIsValid] = useState(false);

  const handleRoomNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRoomName(event.target.value);
    validateForm();
  };

  const handleRoomTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setRoomType({ type: event.target.value, password: roomType.password });
    setShowPasswordInput(event.target.value === "protected");
    validateForm();
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRoomType({ type: roomType.type, password: event.target.value });
    validateForm();
  };

  const validateForm = () => {
    if (roomName && roomType.type) {
      if (roomType.type === "protected" && !roomType.password) {
        setFormIsValid(false);
      } else {
        setFormIsValid(true);
      }
    } else {
      setFormIsValid(false);
    }
  };

  const handleSubmit = () => {
  const data = {
    name: roomName,
    type: roomType.type,
    password: roomType.password,
    };
    console.log(data);
    props.handleCreateRoom(data);
  }
  

  return (
    <Form onSubmit={handleSubmit}>
      <Label htmlFor="roomName">Room Name:</Label>
      <Input
        type="text"
        id="roomName"
        value={roomName}
        onChange={handleRoomNameChange}
      />
  
      <Label htmlFor="roomType">Room Type:</Label>
      <Select id="roomType" value={roomType.type} onChange={handleRoomTypeChange}>
        <option value="">Select a room type</option>
        <option value="public">Public</option>
        <option value="private">Private</option>
        <option value="protected">Protected</option>
      </Select>
  
      {showPasswordInput && (
        <>
          <Label htmlFor="password">Password:</Label>
          <InputPassword
            type="password"
            id="password"
            value={roomType.password || ""}
            onChange={handlePasswordChange}
          />
        </>
      )}
      <SubmitButton type="submit" value="Create Room!" disabled={!(roomName && roomType.type)} />
    </Form>
  );
};

export default Createroomaux;
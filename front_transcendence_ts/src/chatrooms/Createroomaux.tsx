import React, { useState } from "react";

interface CreateroomauxProps {
    handleCreateRoom: (data: any) => void;
  }

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
    <form onSubmit={handleSubmit}>
      <label htmlFor="roomName">Room Name:</label>
      <input
        type="text"
        id="roomName"
        value={roomName}
        onChange={handleRoomNameChange}
      />

      <label htmlFor="roomType">Room Type:</label>
      <select id="roomType" value={roomType.type} onChange={handleRoomTypeChange}>
        <option value="">Select a room type</option>
        <option value="public">Public</option>
        <option value="private">Private</option>
        <option value="protected">Protected</option>
      </select>

      {showPasswordInput && (
        <>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={roomType.password || ""}
            onChange={handlePasswordChange}
          />
        </>
      )}
      <br />
      <br />
      <input type="submit" value="Create Room!" disabled={!(roomName && roomType.type)} />
    </form>
  );
};

export default Createroomaux;
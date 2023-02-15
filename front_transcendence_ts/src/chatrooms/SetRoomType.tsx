import React, { useState } from "react";
import { useParams } from "react-router-dom";
import instance from '../confs/axios_information';

type RoomType = "public" | "protected";

interface SetRoomTypeProps {
    setShowSetRoomType: (show: boolean) => void;
}

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
        console.log(response.data);
        alert("Room type changed!");
        props.setShowSetRoomType(false);
        return 0;
        } catch (error) {
        console.log(error);
        props.setShowSetRoomType(false);
        return 1;
        }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Room Type:
        <select value={roomType} onChange={handleRoomTypeChange}>
          <option value="public">Public</option>
          <option value="protected">Protected</option>
        </select>
      </label>
      {roomType === "protected" && (
        <label>
          Password:
          <input type="password" value={password} onChange={handlePasswordChange} />
        </label>
      )}
      <button type="submit">Submit</button>
    </form>
  );
};

export default SetRoomType;

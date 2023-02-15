import React, { useState } from 'react';
import { ChatRoomDto } from './Roominfo';
import { useEffect } from 'react';

interface UserAdminProps {
    username: string;
    information: any;
}

interface User {
  id: number;
  name: string;
}


const UserAdmin : any = (props : UserAdminProps) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [information, setInformation] = useState<any>(props.information);
  const [users, setUsers] = useState<any[]>(props.information.users);
  const [showOwner, setShowOwner] = useState<boolean>(false);


  useEffect(() => {
    handlePassword(information);
  },[information]);

  function handlePassword(info: any)
  {
    console.log("Wtf");
    if(info)
    {
        console.log("info.owner.name", info.owner.name);
        console.log("Username", props.username);
    if (info.owner.name === props.username)
    {
        console.log("Wtf3");
      setShowOwner(true);
    }
    }
  }

  const filteredUsers = users.filter((user: User) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div>
        {showOwner && <button>Set Password</button>}
        Owner: {information.owner.name}
        <br></br>
      <input
        type="text"
        placeholder="Search users..."
        value={searchTerm}
        onChange={handleSearch}
      />
      <div style={{ overflowY: 'scroll', height: '10em' }}>
        <ul>
          {filteredUsers.map((user: User) => (
            <li key={user.id}>{user.name}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default UserAdmin;
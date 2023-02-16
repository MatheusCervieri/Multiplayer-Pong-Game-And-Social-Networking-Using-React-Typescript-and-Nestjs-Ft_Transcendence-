import React, { useState } from 'react';
import { ChatRoomDto } from './Roominfo';
import { useEffect } from 'react';
import SetRoomType from './SetRoomType';
import SetAdmBtn from './AdminBtns/SetAdmBtn';
import BlockUserBtn from './AdminBtns/BlockUserBtn';
import MuteUserBtn from './AdminBtns/MuteUserBtn';

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
  const [showSetRoomType, setShowSetRoomType] = useState<boolean>(false);


  useEffect(() => {
    handlePassword(information);
    setUsers(props.information.users);
  },[information]);

  function handlePassword(info: any)
  {
    if(info)
    {
    if (info.owner.name === props.username)
    {
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

  function handleSetPassBtn() 
  {
    setShowSetRoomType(!showSetRoomType);
  }


  //Handle buttons click!

  function setAdmButtonClick(username: string) {
    console.log("setAdmButtonClick");
  }

  function BlockUserClick(username: string)
  {
    console.log("BlockUserClick");
  }

  function MuteUserClick(username: string)
  {
    console.log("BlockUserClick");
  }

  return (
    <div>
        {showSetRoomType && <SetRoomType setShowSetRoomType={setShowSetRoomType}/>}
        {showOwner && <button onClick={handleSetPassBtn}>Set Password</button>}
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
            <li key={user.id}>{user.name} 
            <SetAdmBtn username={user.name} AdmBtnClick={setAdmButtonClick}/>
            <BlockUserBtn username={user.name} onBlockUserClick={BlockUserClick}/>
            <MuteUserBtn username={user.name} onMuteUserClick={MuteUserClick}/>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default UserAdmin;
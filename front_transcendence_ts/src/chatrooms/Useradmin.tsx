import React, { useState } from 'react';
import { ChatRoomDto } from './Roominfo';
import { useEffect } from 'react';
import SetRoomType from './SetRoomType';
import SetAdmBtn from './AdminBtns/SetAdmBtn';
import BlockUserBtn from './AdminBtns/BlockUserBtn';
import MuteUserBtn from './AdminBtns/MuteUserBtn';
import instance from '../confs/axios_information';
import { useParams } from 'react-router-dom';
import UndoAdmBtn from './AdminBtns/UndoAdmBtn';
import UnmuteUserBtn from './AdminBtns/UnMuteUserBtn';
import UnblockUserBtn from './AdminBtns/UnBlockUserBtn';
import UnMuteUserBtn from './AdminBtns/UnMuteUserBtn';

interface UserAdminProps {
    username: string;
    information: any;
}

interface User {
  id: number;
  name: string;
}

//Actually we need to pass one more information in the backend that is the 
//room information. I am just passing the users informations of the room. 


const UserAdmin : any = (props : UserAdminProps) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [information, setInformation] = useState<any>();
  const [users, setUsers] = useState<any[]>();
  const [filteredUsers2, setFilteredUsers2] = useState<any[]>([]);
  const [showOwner, setShowOwner] = useState<boolean>(false);
  const [showSetRoomType, setShowSetRoomType] = useState<boolean>(false);
  const { id } = useParams<{ id: string | undefined }>();
  
  useEffect(() => {
    setInformation(props.information);
  },[]);

  useEffect(() => {
    handlePassword(props.information.room);
    setUsers(props.information.users);
  },[information]);

  useEffect(() => {
    filterUsers2();
  },[searchTerm, users]);

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
  
  function filterUsers2()
  {
    if(users)
    {
      setFilteredUsers2(users.filter((user: any) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase())
    ));
    }
  }

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  function handleSetPassBtn() 
  {
    setShowSetRoomType(!showSetRoomType);
  }


  //Handle buttons click!

  async function setAdmButtonClick(username: string) {
    //Create a axios post requisition to this 'make-admin-room/:id'
    const data = { name: username};
    const token = localStorage.getItem('token');
        try {
            const response = await instance.post('room/make-admin-room/' + id, data, 
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
            console.log("Response from setAdmButtonClick: " + response.data);
            return 0;
            } catch (error) {
            console.log(error);
            return 1;
            }

  }

  async function undoAdmBtnClick(username: string)
  {
    //Create a axios post requisition to this 'make-admin-room/:id'
    const data = { name: username};
    const token = localStorage.getItem('token');
        try {
            const response = await instance.post('room/remove-admin-room/' + id, data, 
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
            console.log("Response from undoAdmBtnClick: " + response.data);
            return 0;
            } catch (error) {
            console.log(error);
            return 1;
            }
  }

  async function BlockUserClick(username: string)
  {
    const data = { name: username};
    const token = localStorage.getItem('token');
        try {
            const response = await instance.post('room/block-user-room/' + id, data, 
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
            console.log("Response from setAdmButtonClick: " + response.data);
            return 0;
            } catch (error) {
            console.log(error);
            return 1;
            }

    console.log("BlockUserClick");
  }

  async function UnblockUserClick(username: string)
  {
    const data = { name: username};
    const token = localStorage.getItem('token');
        try {
            const response = await instance.post('room/unblock-user-room/' + id, data, 
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
            console.log("Response from undoAdmBtnClick: " + response.data);
            return 0;
            } catch (error) {
            console.log(error);
            return 1;
            }
    console.log("UnBlockUserClick");
  }

  async function MuteUserClick(username: string)
  {
    const data = { name: username};
    const token = localStorage.getItem('token');
        try {
            const response = await instance.post('room/mute-user-room/' + id, data, 
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
            console.log("Response from setAdmButtonClick: " + response.data);
            return 0;
            } catch (error) {
            console.log(error);
            return 1;
            }
    console.log("BlockUserClick");
  }

  async function UnMuteUserClick(username: string)
  {
    const data = { name: username};
    const token = localStorage.getItem('token');
        try {
            const response = await instance.post('room/unmute-user-room/' + id, data, 
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
            console.log("Response from undoAdmBtnClick: " + response.data);
            return 0;
            } catch (error) {
            console.log(error);
            return 1;
            }
    console.log("UnBlockUserClick");
    console.log("BlockUserClick");
  }

  return (
    <div>
        {showSetRoomType && <SetRoomType setShowSetRoomType={setShowSetRoomType}/>}
        {showOwner && <button onClick={handleSetPassBtn}>Set Password</button>}
        Owner: {props.information.room.owner.name}
        <br></br>
      <input
        type="text"
        placeholder="Search users..."
        value={searchTerm}
        onChange={handleSearch}
      />
      <div style={{ overflowY: 'scroll', height: '10em' }}>
        <ul>
          {filteredUsers2.map((user: any) => (
            <li key={user.id}>{user.name} 
            <SetAdmBtn username={user.name} AdmBtnClick={setAdmButtonClick}/>
            <UndoAdmBtn username={user.name} onUndoAdmClick={undoAdmBtnClick}/>
            <BlockUserBtn username={user.name} onBlockUserClick={BlockUserClick}/>
            <UnblockUserBtn username={user.name} onUnblockUserClick={UnblockUserClick}/>
            <MuteUserBtn username={user.name} onMuteUserClick={MuteUserClick}/>
            <UnMuteUserBtn username={user.name} onUnmuteUserClick={UnMuteUserClick}/>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default UserAdmin;
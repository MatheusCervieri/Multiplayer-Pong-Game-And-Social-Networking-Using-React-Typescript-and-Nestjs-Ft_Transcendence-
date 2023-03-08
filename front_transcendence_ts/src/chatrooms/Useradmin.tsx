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
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Owner = styled.div`
  font-size: 16px;
  margin-bottom: 10px;
`;

const Input = styled.input`
  font-size: 16px;
  padding: 5px;
  border-radius: 5px;
  border: 1px solid #ccc;
  margin-bottom: 10px;
`;

const UserListContainer = styled.div`
  overflow-y: scroll;
  height: 10em;
`;

const UserListItem = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 16px;
  margin-bottom: 10px;
`;

const UserName = styled.span`
  margin-right: 10px;
`;

const UserActions = styled.div`
  display: flex;
`;

const PassButton = styled.button`
  background-color: #007bff;
  color: #fff;
  font-size: 14px;
  padding: 5px 10px;
  border-radius: 5px;
  border: none;
  cursor: pointer;
  margin-right: 10px;
  &:hover {
    background-color: #444;
  }
`;

interface UserAdminProps {
    username: string;
    information: any;
    myStatus: any;
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
  const [userPrivilleges, setuserPrivilleges] = useState<any>([]);
  const [filteredUsers2, setFilteredUsers2] = useState<any[]>([]);
  const [showOwner, setShowOwner] = useState<boolean>(false);
  const [showSetRoomType, setShowSetRoomType] = useState<boolean>(false);
  const { id } = useParams<{ id: string | undefined }>();
  
  useEffect(() => {
    console.log("TESTESSSSSDAS SADSA DSA DASDSA DASD ASD");
    console.log("PROPS INFORMATION", props.information);
    setInformation(props.information);
    console.log("INFORMATION", information);
   
  },[]);
 

  useEffect(() => {
    handlePassword(props.information.sanitizedRoom);
    setuserPrivilleges(props.myStatus);
    setUsers(props.information.users);
    console.log("USERSSSSSSSSS", users);
  },[information, props.information, props.myStatus]);

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
   <>{props.information &&
  <Container>
  {showSetRoomType && <SetRoomType setShowSetRoomType={setShowSetRoomType} />}
  {showOwner && <PassButton onClick={handleSetPassBtn}>Set Password</PassButton> }
  <br></br>
  <Owner>Owner: {props.information.sanitizedRoom.owner.name}</Owner>
  <Input
    type="text"
    placeholder="Search users..."
    value={searchTerm}
    onChange={handleSearch}
  />
  <UserListContainer>
    <ul>
      {filteredUsers2.map((user: any) => (
        <UserListItem key={user.id}>
          <UserName>{user.name}</UserName>
          {userPrivilleges.name !== user.name && (
            <UserActions>
              {userPrivilleges.isOwner === true && (
                <>
                 {user.status.isAdmin === false && <SetAdmBtn username={user.name} AdmBtnClick={setAdmButtonClick}/>}
                  {user.status.isAdmin === true && <UndoAdmBtn username={user.name} onUndoAdmClick={undoAdmBtnClick}/>}
                </>
              )}
              {(userPrivilleges.isOwner === true || userPrivilleges.isAdmin === true) && (
                <>
              {user.status.isBlocked === false && <BlockUserBtn username={user.name} onBlockUserClick={BlockUserClick}/>}
              {user.status.isBlocked === true && <UnblockUserBtn username={user.name} onUnblockUserClick={UnblockUserClick}/>}
              {user.status.isMuted === false && <MuteUserBtn username={user.name} onMuteUserClick={MuteUserClick}/>}
              {user.status.isMuted === true && <UnMuteUserBtn username={user.name} onUnmuteUserClick={UnMuteUserClick}/>}
                  
                </>
              )}
            </UserActions>
          )}
        </UserListItem>
      ))}
    </ul>
  </UserListContainer>
</Container>}</>
              );
};

export default UserAdmin;
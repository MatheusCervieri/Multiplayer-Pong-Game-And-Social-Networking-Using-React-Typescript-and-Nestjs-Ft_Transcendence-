import React, { useState, useEffect } from 'react';
import  instance, { serverurl } from '../confs/axios_information';
import { toast } from "react-toastify";
import styled from "styled-components";

const Container = styled.div`
  background-color: #f2f2f2;
  border-radius: 10px;
  padding: 20px;
`;

const Title = styled.h2`
  color: #00b8d9;
  font-size: 24px;
  margin-bottom: 10px;
`;

const List = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
`;

const ListItem = styled.li`
  align-items: center;
  display: flex;
  justify-content: space-evenly;
  margin-bottom: 10px;
  padding: 10px;
  background-color: #f2f2f2;
  border-radius: 4px;

  & > div {
    display: flex;
    align-items: center;
  }

  & > div:last-child {
    margin-left: auto;
  }
`;

const Name = styled.span`
  color: #333333;
  font-size: 16px;
  font-weight: bold;
`;

const Status = styled.span<{ status: string }>`
  font-size: 16px;
  color: ${({ status }) => {
    switch (status) {
      case "Online":
        return "#4caf50"; // green
      case "Playing":
        return "#9c27b0"; // purple
      case "Offline":
        return "#f44336"; // red
      default:
        return "#000"; // default color (black)
    }
  }};
`;

const Image = styled.img`
  border-radius: 50%;
  margin-left: 10px;
`;

const Button = styled.button`
  background-color: ${({color}) => color};
  border: none;
  border-radius: 5px;
  color: white;
  cursor: pointer;
  font-size: 14px;
  margin-left: 10px;
  padding: 8px 16px;
`;

interface UserProps {
  socket : any;
}


const Users = (props : UserProps) => {
  const [users, setUsers] = useState<any[]>([]);


  function getUserInformation()
  {
    const token = localStorage.getItem('token');
    instance.get('userdata/userstatus' , {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
    .then(response => {
      console.log(response.data);
      const sortedUsers = sortUsersByStatus(response.data); // sort the users array by status
      setUsers(sortedUsers);
    })
    .catch(error => {
      console.error(error);
    });
  }
  useEffect(() => {
    getUserInformation();
  }, []);

  //socket.emit('authenticate', { token: token , game_id: id});

  function addAsFriend(name : any)
  {
    const token = localStorage.getItem('token');
    const data = { userToAddName : name}
    instance.post('userdata/addfriend' , data,  {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
    .then(response => {
      console.log(response.data);
      toast.success("Friend added!");
    })
    .catch(error => {
      console.error(error);
    });
  }

  function Block(name : any)
  {
    const token = localStorage.getItem('token');
    const data = { userToBlockName : name}
    instance.post('userdata/block' , data,  {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
    .then(response => {
      console.log(response.data);
      toast.success("User blocked");
    })
    .catch(error => {
      console.error(error);
    });
  }

  function sortUsersByStatus(users: any[]): any[] {
    const sortedUsers = [...users];
  
    sortedUsers.sort((a, b) => {
      if (a.status === "Online" && b.status !== "Online") {
        return -1; // a comes first
      } else if (a.status !== "Online" && b.status === "Online") {
        return 1; // b comes first
      } else if (a.status === "Playing" && b.status !== "Playing") {
        return -1; // a comes first
      } else if (a.status !== "Playing" && b.status === "Playing") {
        return 1; // b comes first
      } else {
        return 0; // no change in order
      }
    });
    return sortedUsers;
  }
  /*

  */

  return (
    <Container>
      <Title>Users</Title>
      <List>
        {users.map((user) => (
          <ListItem key={user.id}>
            
            <div>
            <Image src={serverurl + "/publicimage/profileimage/" + user.id } alt="Profile" width="50" height="50" />
            {"   "}
              <Name>{user.name}</Name>
              {" - "}
              <Status status={user.status}>{user.status}</Status>
            </div>
            <div>
              
              <Button color="#00b8d9" onClick={() => {
                console.log(user.name);
                const token = localStorage.getItem('token');
                const data = { token: token, playerToPlayName : user.name}
                props.socket.emit('invite-game', data);
              }}>Invite to Play</Button>
              <Button color="#4caf50" onClick={() => {
                addAsFriend(user.name);
              }}>Add as Friend!</Button>
              <Button color="#f44336" onClick={() => {
                Block(user.name);
              }}>Block</Button>
            </div>
          </ListItem>
        ))}
      </List>
    </Container>
  );
};

export default Users;
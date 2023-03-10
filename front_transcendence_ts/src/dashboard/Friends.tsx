import React, { useState, useEffect } from 'react';
import  instance, { serverurl } from '../confs/axios_information';
import { toast } from "react-toastify";
import styled from 'styled-components';

interface UserProps {
  socket : any;
}

const Container = styled.div`
  margin-top: 20px;
  margin: 15px
`;

const Scroller = styled.div`
  height: 400px;
  overflow-y: scroll;
  border-radius: 10px;
  padding: 10px;
  margin: 5px;
  margin-left: auto; 

  ::-webkit-scrollbar {
    width: 8px;
  }
  
  ::-webkit-scrollbar-track {
    background: #f1f1f1;
  }
  
  ::-webkit-scrollbar-thumb {
    background: #00b8d9;
    border-radius: 4px;
  }
  
  ::-webkit-scrollbar-thumb:hover {
    background: #555;
  }
`;

const Title = styled.h2`
  font-size: 24px;
  margin-bottom: 10px;
  color: #00b8d9;
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
  border: 2px solid #00b8d9;

  & > div {
    display: flex;
    align-items: center;
  }

  & > div:last-child {
    margin-left: auto;
  }
`;

const Name = styled.span`
  font-size: 18px;
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
`;

const Button = styled.button`
  background-color: ${({ color }) => color};
  border: none;
  border-radius: 4px;
  color: #fff;
  cursor: pointer;
  font-size: 14px;
  margin-left: 10px;
  padding: 8px 16px;
  transition: background-color 0.2s ease-in-out;

  &:hover {
    background-color: ${({ color }) => color + "bf"};
  }
`;


const Friends = (props : UserProps) => {
  const [users, setUsers] = useState<any[]>([]);


  function getUserInformation()
  {
    const token = localStorage.getItem('token');
    instance.get('userdata/friends' , {
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

  return (
    <Container>
    <Scroller>
      <Title>Friends</Title>
      <List>
        {users.map((user) => (
          
          <ListItem key={user.id}>
            <div>
              <Image src={serverurl + "/publicimage/profileimage/" + user.id} alt="Profile" width="50" height="50" />
              {" "}
              <Name>{user.name}</Name>
              <Status status={user.status}> {" - "} {user.status}</Status>
            </div>
            <div>
              <Button color="#00b8d9" onClick={() => {
                const token = localStorage.getItem('token');
                const data = { token: token, playerToPlayName : user.name}
                props.socket.emit('invite-game', data);
              }}>Invite to Play</Button>
            </div>
          </ListItem> 
        ))}
      </List>
      </Scroller>
    </Container>
  );

};

export default Friends;
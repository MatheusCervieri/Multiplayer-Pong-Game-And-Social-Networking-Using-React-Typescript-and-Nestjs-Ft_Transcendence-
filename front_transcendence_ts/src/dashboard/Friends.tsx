import React, { useState, useEffect } from 'react';
import  instance, { serverurl } from '../confs/axios_information';
import { toast } from "react-toastify";
import styled from 'styled-components';

interface UserProps {
  socket : any;
}

const Container = styled.div`
  margin-top: 20px;
`;

const Title = styled.h2`
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
  font-size: 18px;
  font-weight: bold;
`;

const Status = styled.span<{ status: string }>`
  font-size: 16px;
  color: ${({ status }) => {
    switch (status) {
      case "online":
        return "#4caf50"; // green
      case "playing":
        return "#9c27b0"; // purple
      case "offline":
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
      setUsers(response.data);
    })
    .catch(error => {
      console.error(error);
    });
  }
  useEffect(() => {
    getUserInformation();
  }, []);

  //socket.emit('authenticate', { token: token , game_id: id});
  /*

  */

  return (
    <Container>
      <Title>Friends</Title>
      <List>
        {users.map((user) => (
          <ListItem key={user.id}>
            <div>
              <Image src={serverurl + "/publicimage/profileimage/" + user.id} alt="Profile" width="50" height="50" />
              {" "}
              <Name>{user.name}</Name>
              <Status status={user.status}>{user.status}</Status>
            </div>
            <div>
             
              <Button color="#00b8d9" onClick={() => {
                console.log(user.name);
                const token = localStorage.getItem('token');
                const data = { token: token, playerToPlayName : user.name}
                props.socket.emit('invite-game', data);
              }}>Invite to Play</Button>
            </div>
          </ListItem>
        ))}
      </List>
    </Container>
  );

};

export default Friends;
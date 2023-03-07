import React, { useState, useEffect } from 'react';
import  instance, { serverurl } from '../confs/axios_information';
import styled from 'styled-components';

const Container = styled.div`
  margin-top: 20px;
`;

const Title = styled.h2`
  font-size: 24px;
  text-align: center;
  margin-bottom: 10px;
`;

const List = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
`;

const ListItem = styled.li`
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  padding: 10px;
  background-color: #f2f2f2;
  border-radius: 4px;
  border: 1px solid #ccc;
`;

const Name = styled.span`
  font-size: 18px;
  font-weight: bold;
`;

const Image = styled.img`
  border-radius: 50%;
`;

const Rank = styled.h2`
  font-size: 24px;
  margin: 0 10px;
`;

const Info = styled.div`
  display: flex;
  align-items: center;
`;

const Stat = styled.span<{ type: string }>`
  font-size: 14px;
  margin-left: 10px;
  padding: 2px 6px;
  border-radius: 4px;
  background-color: ${({ type }) => {
    switch (type) {
      case "wins":
        return "#4caf50"; // green
      case "losts":
        return "#f44336"; // red
      default:
        return "#ccc"; // default color (gray)
    }
  }};
  color: #fff;
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


const Ranking = () => {
  const [users, setUsers] = useState<any[]>([]);


  function getUserInformation()
  {
    const token = localStorage.getItem('token');
    instance.get('userdata/usersranking' , {
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



  return (
    <Container>
      <Title>Ranking: </Title>
      <br></br>
      <List>
        {users.map((user) => (
          <ListItem key={user.id}>
            <Info>
              <Rank>{user.rankingP}</Rank>
              <Image src={serverurl + "/publicimage/profileimage/" + user.id } alt="Profile" width="50" height="50" />
              <div>
                <Name>{user.name}</Name>
                <Status status={user.status}>{user.status}</Status>
              </div>
            </Info>
            <div>
              <Stat type="wins">Wins: {user.wins}</Stat>
              <Stat type="losts">Losts: {user.losts}</Stat>
            </div>
          </ListItem>
        ))}
      </List>
    </Container>
  );
};

export default Ranking;
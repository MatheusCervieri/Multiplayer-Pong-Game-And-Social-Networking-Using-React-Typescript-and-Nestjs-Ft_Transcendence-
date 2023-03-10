import React, { useEffect } from 'react';
import {useState} from 'react';
import { useNavigate } from 'react-router-dom';
import  instance from '../confs/axios_information';
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
  align-items: center;
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

const Button = styled.button<{ color: string }>`
  padding: 5px 10px;
  border: none;
  border-radius: 4px;
  background-color: ${({ color }) => color};
  color: #fff;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.2s ease-in-out;

  &:hover {
    background-color: ${({ color }) => color === "#f44336" ? "#e53935" : "#00b8d9"};
  }
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



const RunningGames = () => {
    const [games, setGames] = useState<any[]>([]);
    const navigate = useNavigate();

    function watchBtn(gameid: any)
    {
      navigate('../game/'  + gameid);
    }

    useEffect(() => {
      getRunningGames();
    }, []);

    function getRunningGames()
    {
      const token = localStorage.getItem('token');
      instance.get('games/running/' , {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(response => {
        console.log(response.data);
        setGames(response.data);
      })
      .catch(error => {
        console.error(error);
      });
    }

    return (
      <Container>
        <Scroller>
        <Title>Running Games:</Title>
        <List>
          {games.map((game) => (
            <ListItem key={game.id}>
              <Name>{game.name}</Name>
              <Button color="#00b8d9" onClick={() => watchBtn(game.id)}>Watch</Button>
            </ListItem>
          ))}
        </List>
        </Scroller>
      </Container>
    );
}

export default RunningGames;
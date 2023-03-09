import React, { useState, useEffect, FC } from 'react';
import axios from 'axios';
import { serverurl } from '../../confs/axios_information';
import styled from 'styled-components';

interface UserSearchProps {
  btnName: string;
  handleUser: (user : string) => void;
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Input = styled.input`
  padding: 8px;
  border: 1px solid gray;
  border-radius: 4px;
  font-size: 16px;
  margin-bottom: 16px;
`;

const Ul = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const Li = styled.li`
  padding: 8px;
  border: 1px solid gray;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  margin-bottom: 8px;
  &:hover {
    background-color: lightgray;
  }
`;

const Button = styled.button`
  padding: 8px 16px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  margin-top: 16px;
`;

const UserSearch = (props: UserSearchProps) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [users, setUsers] = useState<string[]>([]);
    const [filteredUsers, setFilteredUsers] = useState<string[]>([]);
    const [selectedUser, setSelectedUser] = useState("");
  
    useEffect(() => {
      axios.get<string[]>(serverurl + '/users/names')
        .then(response => {
          setUsers(response.data);
        });
    }, []);
  
    useEffect(() => {
        setFilteredUsers(
          users.filter(user =>
            user.toLowerCase().startsWith(searchTerm.toLowerCase())
          )
        );
      }, [searchTerm]);
  
    const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchTerm(e.target.value);
    };
  
    const handleUserSelection = (user: string) => {
      setSelectedUser(user);
      setSearchTerm(user);
    };

    function btnClick()
    {
      props.handleUser(searchTerm);
    }
  
    return (
      <Container>
        <br></br>
      <Input type="text" value={searchTerm} onChange={handleSearchInput} />
      <Ul>
      {filteredUsers.slice(0, 5).map((user, index) => {
    if (user.trim() !== '') {
      return (
        <Li key={user + index} onClick={() => handleUserSelection(user)}>
          {user}
        </Li>
      );
    }
    return null;
    })}
      </Ul>
      <Button onClick={btnClick}>{props.btnName}</Button>
    </Container>
    );
  };
  
  export default UserSearch;

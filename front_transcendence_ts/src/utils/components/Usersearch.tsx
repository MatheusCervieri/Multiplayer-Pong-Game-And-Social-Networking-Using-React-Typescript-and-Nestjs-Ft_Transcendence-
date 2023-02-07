import React, { useState, useEffect, FC } from 'react';
import axios from 'axios';
import { serverurl } from '../../confs/axios_information';

interface UserSearchProps {
  btnName: string;
  handleUser: (user : string) => void;
}

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
      <div>
        <input type="text" value={searchTerm} onChange={handleSearchInput} />
        <ul>
        {filteredUsers.slice(0,5).map((user, index) => (
            <li key={user + index} onClick={() => handleUserSelection(user)}>
              {user}
            </li>
          ))}
        </ul>
        <button onClick={btnClick}>{props.btnName}</button>
      </div>
    );
  };
  
  export default UserSearch;

import React from 'react'
import { Button } from 'react-native/types';
import Blockuser from './Blockuser';
import styled from 'styled-components';
import ProfileBtn from './UserOptionsBtns/ProfileBtn';
import DmBtn from './UserOptionsBtns/DmBtn';
import InviteToPlayBtn from './UserOptionsBtns/InvitePlayBtn';

interface UserOptionsProps {
    user: string;
    setBlockedUsers : (blockedUsers : string[]) => void;
    loadBlocks: any;
    me: string;
    socket : any;
}

const UserOptionsContainer = styled.div`
  display: flex;
  justify-content: flex-start;
`;

const OptionButton = styled.button`
  background-color: #0275d8;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;

  &:hover {
    background-color: #025aa5;
  }
`;

export {OptionButton};

export default function UserOptions(props: UserOptionsProps) {
  return (
    <UserOptionsContainer>
        <Blockuser setBlockedUsers={props.setBlockedUsers} blockeduser={props.user} loadBlocked={props.loadBlocks}/>
        <ProfileBtn name={props.user}></ProfileBtn>
        <InviteToPlayBtn name={props.user} me={props.me} socket={props.socket}></InviteToPlayBtn>
    </UserOptionsContainer>
  )
}

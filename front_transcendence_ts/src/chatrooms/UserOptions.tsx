import React from 'react'
import { Button } from 'react-native/types';
import Blockuser from './Blockuser';

interface UserOptionsProps {
    user: string;
}

export default function UserOptions(props: UserOptionsProps) {
  return (
    <div>
        <Blockuser blockeduser={props.user}/>
        <button>Profile</button>
        <button>DM</button>
        <button>Invite to Play</button>
    </div>
  )
}

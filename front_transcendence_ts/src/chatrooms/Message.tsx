import React from 'react'
import UserOptions from './UserOptions';

interface MessageProps {
    username: string;
    index: number;
    user: string;
    message: string;
}

export default function Message(props: MessageProps) {
    const [userOptions, setUserOptions] = React.useState(false);

    function handleUserOptionsBtn(){
        setUserOptions(!userOptions);
    }
  return (
    <div>
        {props.username !== props.user && userOptions && <UserOptions user={props.user}/>}
        <li key={props.index}>{props.user} {props.username !== props.user && <button onClick={handleUserOptionsBtn}>+</button>} : {props.message}</li>
    </div>

  )
}

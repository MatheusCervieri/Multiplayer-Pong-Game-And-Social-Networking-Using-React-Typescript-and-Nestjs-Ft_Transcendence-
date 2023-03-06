import React, { useEffect } from 'react'
import { OptionButton } from '../UserOptions';
import { useNavigate } from 'react-router-dom';


interface ProfileProps {
    name: string;
    me: string
    socket: any;
}


export default function InvitePlayBtn(props : ProfileProps) {
    const navigate = useNavigate();

  useEffect(() => {

  }, []);

    function handleBtn(){
      const token = localStorage.getItem('token');
      const data = { token: token, playerToPlayName : props.name}
      props.socket.emit('invite-game', data);
    }


  return (
    <>
    <div><OptionButton onClick={handleBtn}>Invite to Play</OptionButton></div>
    </>
  )
}

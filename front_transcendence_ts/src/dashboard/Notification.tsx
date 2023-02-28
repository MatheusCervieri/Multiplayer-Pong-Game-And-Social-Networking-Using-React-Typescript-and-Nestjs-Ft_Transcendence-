import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { io } from 'socket.io-client';


interface invitation {
    playerThatInvited: any,
    invitedPlayer: any,
    id: any,
  }

interface NotificationProps {
    socket: any;
}

export default function Notification(props: NotificationProps) {
    const navigate = useNavigate();
    const [inviteDiv, setInviteDiv] = useState<boolean>(false);
    const [invitationData , setInvitationData] = useState<invitation>();
    const {socket} = props;

    useEffect(() => {
      
      socket.on("connect", () => {
        
      });
      socket.on("disconnect", () => {
       
      });
  
      socket.on("receive-invitation", (data: invitation) => {
        setInvitationData(data);
        setInviteDiv(true);
        toast.error("You have been invite to someone");
      });
  
      socket.on("invitation-work", (data: invitation) => {
        navigate('game/' + data.id);
        toast.error("You invite someone to play with you");
      });
  
  
      socket.on("message", (data: any) => {
        toast.error(data);
      });
  
      return () => {
          socket.off('connect');
          socket.off('disconnect');
        };
    }, []);
  
    useEffect(() => {
      const token = localStorage.getItem('token');
      if (token)
        socket.emit('authenticate', { token: token});
    }, []);
  
  return (
    <>
    {
        inviteDiv && invitationData &&
    <div>
       {invitationData.playerThatInvited.name} invite you to play a game!!!
       <button>Accept Invitation!</button>
       <button>Decline Invitation!</button> 
    </div>
    }
    </>
  )
}

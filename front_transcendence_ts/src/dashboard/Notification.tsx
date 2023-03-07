import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { io } from 'socket.io-client';
import styled from 'styled-components';


interface invitation {
    playerThatInvited: any,
    invitedPlayer: any,
    id: any,
  }

interface NotificationProps {
    socket: any;
}

const Container = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Content = styled.div`
  background-color: #fff;
  padding: 20px;
  border-radius: 4px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
`;

const Title = styled.h2`
  font-size: 24px;
  margin-bottom: 10px;
`;

const Message = styled.p`
  font-size: 18px;
  margin-bottom: 20px;
`;

const Button = styled.button<{color : string}>`
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  background-color: ${({ color }) => color};
  color: #fff;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.2s ease-in-out;

  &:hover {
    background-color: ${({ color }) => color === "#f44336" ? "#e53935" : "#00b8d9"};
  }

  & + & {
    margin-left: 10px;
  }
`;


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

    function acceptInvitation()
    {
        setInviteDiv(false);
        if(invitationData)
            navigate('game/' + invitationData.id);
    }

    
    function declineInvitation()
    {
    const token = localStorage.getItem('token');
      if (token)
        socket.emit('decline-invite', { token: token, invitation: invitationData});
    setInviteDiv(false);

    }
  
    return (
      <>
         {
        inviteDiv && invitationData &&
        <Container>
        <Content>
          <Title>You have a game invitation!</Title>
          <Message>{invitationData.playerThatInvited.name} has invited you to play a game!</Message>
          <Button color="#4caf50" onClick={acceptInvitation}>Accept Invitation</Button>
          <Button color="#f44336" onClick={declineInvitation}>Decline Invitation</Button>
        </Content>
        </Container>
        }
     </>
    );
  
}

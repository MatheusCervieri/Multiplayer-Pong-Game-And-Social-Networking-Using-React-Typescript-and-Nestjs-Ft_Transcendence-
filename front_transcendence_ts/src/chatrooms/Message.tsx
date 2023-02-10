import React from 'react'
import styled from 'styled-components';
import UserOptions from './UserOptions';

interface MessageProps {
    username: string;
    index: number;
    user: string;
    message: string;
}

const MessageContainer = styled.li`
  font-size: 18px;
  display: flex;
  align-items: flex-start;
  margin: 12px;
  background-color: #eee;
  border-radius: 5px;
`;

const UserName = styled.div`
    flex-basis: 20%;
  font-weight: bold;
`;

const UserOptionsButton = styled.button`
  background-color: transparent;
  border: none;
  cursor: pointer;
  font-size: 16px;
  margin-left: 10px;
`;

const MessageText = styled.div`
  margin: 7px;
`;

export default function Message(props: MessageProps) {
    const [userOptions, setUserOptions] = React.useState(false);

    function handleUserOptionsBtn(){
        setUserOptions(!userOptions);
    }
    return (
      <MessageContainer>
        <div>
          {props.username !== props.user && userOptions && <UserOptions user={props.user} />}
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <UserName>
            {props.user}
            {props.username !== props.user && (
              <UserOptionsButton onClick={handleUserOptionsBtn}>
                +
              </UserOptionsButton>
            )} :
          </UserName>
          <MessageText>{props.message}</MessageText>
        </div>
      </MessageContainer>
    );
}
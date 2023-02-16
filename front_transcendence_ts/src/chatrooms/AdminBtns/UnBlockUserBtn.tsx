import React from 'react';
import styled from 'styled-components';

const UnblockUserButton = styled.button`
  background-color: green;
  color: white;
  padding: 8px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
`;

interface UnblockUserBtnProps {
  username: string;
  onUnblockUserClick: (username: string) => void;
}

export default function UnblockUserBtn(props: UnblockUserBtnProps) {
  function handleClick() {
    props.onUnblockUserClick(props.username);
  }

  return (
    <UnblockUserButton onClick={handleClick}>
      Unblock
    </UnblockUserButton>
  );
}
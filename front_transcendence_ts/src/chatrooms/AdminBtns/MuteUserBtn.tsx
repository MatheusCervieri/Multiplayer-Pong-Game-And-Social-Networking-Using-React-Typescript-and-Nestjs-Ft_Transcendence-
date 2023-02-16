import React from 'react';
import styled from 'styled-components';

const MuteUserButton = styled.button`
  background-color: orange;
  color: white;
  padding: 8px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
`;

interface MuteUserBtnProps {
  username: string;
  onMuteUserClick: (username: string) => void;
}

export default function MuteUserBtn(props: MuteUserBtnProps) {
  function handleClick() {
    props.onMuteUserClick(props.username);
  }

  return (
    <MuteUserButton onClick={handleClick}>
      Mute
    </MuteUserButton>
  );
}

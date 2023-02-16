import React from 'react';
import styled from 'styled-components';

const UnmuteUserButton = styled.button`
  background-color: blue;
  color: white;
  padding: 8px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
`;

interface UnmuteUserBtnProps {
  username: string;
  onUnmuteUserClick: (username: string) => void;
}

export default function UnmuteUserBtn(props: UnmuteUserBtnProps) {
  function handleClick() {
    props.onUnmuteUserClick(props.username);
  }

  return (
    <UnmuteUserButton onClick={handleClick}>
      Unmute
    </UnmuteUserButton>
  );
}
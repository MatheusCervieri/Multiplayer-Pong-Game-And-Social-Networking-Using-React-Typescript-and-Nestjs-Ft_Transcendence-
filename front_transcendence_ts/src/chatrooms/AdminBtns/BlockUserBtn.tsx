import React from 'react';
import styled from 'styled-components';

const BlockUserButton = styled.button`
  background-color: red;
  color: white;
  padding: 8px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
`;

interface BlockUserBtnProps {
  username: string;
  onBlockUserClick: (username: string) => void;
}

export default function BlockUserBtn(props: BlockUserBtnProps) {
  function handleClick() {
    props.onBlockUserClick(props.username);
  }

  return (
    <BlockUserButton onClick={handleClick}>
      Block
    </BlockUserButton>
  );
}
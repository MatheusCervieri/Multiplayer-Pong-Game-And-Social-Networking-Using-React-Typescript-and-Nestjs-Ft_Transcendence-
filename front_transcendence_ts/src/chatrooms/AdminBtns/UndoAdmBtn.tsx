import React from 'react';
import styled from 'styled-components';

const UndoAdmButton = styled.button`
  background-color: #6c757d;
  color: white;
  padding: 8px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
`;

interface UndoAdmBtnProps {
  username: string;
  onUndoAdmClick: (username: string) => void;
}

export default function UndoAdmBtn(props: UndoAdmBtnProps) {
  function handleClick() {
    props.onUndoAdmClick(props.username);
  }

  return (
    <UndoAdmButton onClick={handleClick}>
      Undo ADM
    </UndoAdmButton>
  );
}
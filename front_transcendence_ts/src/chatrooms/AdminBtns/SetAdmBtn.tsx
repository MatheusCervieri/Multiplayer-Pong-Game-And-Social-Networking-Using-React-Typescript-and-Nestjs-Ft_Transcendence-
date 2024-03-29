import React from 'react'
import styled from 'styled-components'

const SetAdmButton = styled.button`
 background-color: #50575e;
  color: white;
  padding: 8px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
`;

interface SetAdmBtnProps {
    username: string;
    AdmBtnClick: (username: string) => void;
}

export default function SetAdmBtn(props:SetAdmBtnProps) {
    function handleClick() {
        props.AdmBtnClick(props.username);
    }

  return (
    <SetAdmButton onClick={handleClick}>Set ADM</SetAdmButton>
  )
}

import React from 'react'
import styled from 'styled-components'

const SetAdmButton = styled.button`

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

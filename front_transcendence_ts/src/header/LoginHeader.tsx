import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import  instance, { serverurl } from '../confs/axios_information';

const HeaderWrapper = styled.header`
  align-items: center;
  background-color: #ff8800;
  padding: 1rem;
  color: #fff;
`;

const Title = styled.h1`
  text-align: center;
  font-size: 2rem;
  margin: 0;
  cursor: pointer;
`;


const Header = () => {

  return (
    <HeaderWrapper>
      <Title >Multiplayer Pong</Title>
    </HeaderWrapper>
  );
};

export default Header;

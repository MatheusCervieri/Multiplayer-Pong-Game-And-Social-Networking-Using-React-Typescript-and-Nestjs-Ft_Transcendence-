import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import  instance, { serverurl } from '../confs/axios_information';

const HeaderWrapper = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #ff8800;
  padding: 1rem;
  color: #fff;
`;

const Title = styled.h1`
  font-size: 2rem;
  margin: 0;
`;

const Nav = styled.nav`
  display: flex;
`;

const NavLink = styled.a`
  color: #fff;
  margin-right: 1rem;
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
`;

const ProfileImage = styled.img`
  height: 3em;
  width: 3em;
  object-fit: cover;
`;

const UserName = styled.p`
  margin-right: 1rem;
`;


type HeaderProps = {
  showNav?: boolean;
};


//Image
//Playername
//Social 

const Header: React.FC<HeaderProps> = ({ showNav = true }) => {
  const [user, setUserInformation] = useState<any>({});



  function getUserInformation()
  {
    const token = localStorage.getItem('token');
    instance.get('userdata/myprofile' , {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
    .then((response: any) => {
      console.log(response.data);
      console.log(response.data.id);
      setUserInformation(response.data);
    })
    .catch((error : any) => {
      console.error(error);
    });
  }

  useEffect(() => {
    getUserInformation();
  }, []);

  function TitleClick()
  {
    alert("teste");
  }

  return (
    <HeaderWrapper>
      <Title onClick={TitleClick}>Multiplayer Pong</Title>
      {showNav && (
        <Nav>
          <NavLink href="/">Home</NavLink>
          <NavLink href="/about">About</NavLink>
          <NavLink href="/contact">Contact</NavLink>
          <UserName>{user.name}</UserName>
          {user.id && <ProfileImage src={serverurl + "/publicimage/profileimage/" + user.id }></ProfileImage>}
        </Nav>
      )}
    </HeaderWrapper>
  );
};

export default Header;

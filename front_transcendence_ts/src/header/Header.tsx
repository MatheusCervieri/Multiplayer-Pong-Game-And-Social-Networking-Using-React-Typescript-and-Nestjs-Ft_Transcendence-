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
  cursor: pointer;
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
  border-radius: 50%;
`;

const UserName = styled.p`
  margin-right: 1rem;
`;


const Menu = styled.ul<{open : boolean}>`
  position: absolute;
  color: white;
  top: 4rem;
  right: 0;
  background-color: #00b8d9;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  border-radius: 0.25rem;
  z-index: 1;
  overflow: hidden;
  max-height: 0;
  transition: max-height 0.2s ease-out;
  list-style: none;
  padding: 0; /* remove built-in padding */

  ${({ open }) =>
    open &&
    `
    max-height: 20rem;
  `}
`;

const MenuItem = styled.li`
  padding: 0.5rem 1rem;
  font-size: 1rem;
  color: black;

  cursor: pointer;

  &:hover {
    background-color: #f1f1f1;
  }
`;

type HeaderProps = {
  showNav?: boolean;
};


const Header: React.FC<HeaderProps> = ({ showNav = true }) => {
  const [user, setUserInformation] = useState<any>({});
  const [showMenu, setShowMenu] = useState(false);
  const navigate = useNavigate();



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
    navigate('/dashboard');
  }

  function handleMenuClick() {
    setShowMenu(!showMenu);
  }


  return (
    <HeaderWrapper>
      <Title onClick={TitleClick}>Multiplayer Pong</Title>
      {showNav && (
        <Nav>
          <UserName>{user.name}</UserName>
          {user.id && <ProfileImage onClick={handleMenuClick} src={serverurl + "/publicimage/profileimage/" + user.id }></ProfileImage>}
          <Menu open={showMenu}>
          <MenuItem onClick={() => {navigate('myperfil')}}>My Profile</MenuItem>
          <MenuItem onClick={() => {navigate('users')}}>Users</MenuItem>
          <MenuItem onClick={() => {navigate('friends')}}>Friends</MenuItem>
          <MenuItem onClick={() => {
                localStorage.removeItem('token');
                navigate('../42');
              }}>Log Out!</MenuItem>
          </Menu>
        </Nav>
      )}
    </HeaderWrapper>
  );
};

export default Header;

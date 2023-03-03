import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

export const AuthCallbackRegister: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();


  useEffect(() => {
    const token = Cookies.get('loginToken');
    //save the token in the local storage
    if (token) {
      localStorage.setItem('token', token);
      //redirect to the dashboard
      navigate('/setname');
    }
  }, []);

  return (
    <></>
  );
};
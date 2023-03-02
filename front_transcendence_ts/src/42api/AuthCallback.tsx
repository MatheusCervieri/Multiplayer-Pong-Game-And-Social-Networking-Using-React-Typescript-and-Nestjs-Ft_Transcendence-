import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

export const AuthCallback: React.FC = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const navigate = useNavigate();


  useEffect(() => {
    const token = Cookies.get('loginToken');
    console.log(token)
    //save the token in the local storage
    if (token) {
      localStorage.setItem('token', token);
      //redirect to the dashboard
      navigate('/dashboard');
    }
  }, []);

  return (
    <></>
  );
};
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Cookies from 'js-cookie';

export const AuthCallback: React.FC = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const token = searchParams.get('enc');
  const newUser = searchParams.get('newUser');
  const [decodedToken, setDecodedToken] = useState<string>('');
  const [loginToken, setLoginToken] = useState<string>();

  useEffect(() => {
    const token = Cookies.get('loginToken');
    setLoginToken(token);
    console.log(token);
  }, []);

  useEffect(() => {
    if (token) {
      setDecodedToken('');
    }
  }, []);

  function teste()
  {
    console.log(loginToken);
    console.log(Cookies.get("loginToken"));
  }
  return (
    <div>
      <button onClick={teste}>teste</button>
      <p>token = {token}</p>
      <p>encodedtoken = {decodedToken}</p>
      <p>ID: {newUser}</p>
    </div>
  );
};
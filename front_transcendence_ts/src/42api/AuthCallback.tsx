import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

export const AuthCallback: React.FC = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const token = searchParams.get('enc');
  const newUser = searchParams.get('newUser');
  const [decodedToken, setDecodedToken] = useState<string>('');

  useEffect(() => {
    if (token) {
      setDecodedToken('');
    }
  }, []);

  return (
    <div>
      <p>token = {token}</p>
      <p>encodedtoken = {decodedToken}</p>
      <p>ID: {newUser}</p>
    </div>
  );
};
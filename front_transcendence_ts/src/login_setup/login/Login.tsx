import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import instance from '../../confs/axios_information';
import { useNavigate } from 'react-router-dom';

const loginDTO = {
  email: 'your-email',
  password: 'your-password',
};

type dtotype = typeof loginDTO;

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    loginDTO.email = email;
    loginDTO.password = password;
    const result = await PostLogin(loginDTO);
    if (result === 0)
    {
      navigate('/dashboard');
    }
    else
    {
      alert("Error Login!");
    }
  }

  async function PostLogin(dto: dtotype): Promise<number>{
    try {
      const response = await instance.post('login', dto);
      localStorage.setItem('token', response.data);
      
      return 0;
    } catch (error) {
      
      return 1;
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Email:
        <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} />
      </label>
      <br />
      <label>
        Password:
        <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
      </label>
      <br />
      <label>
      <button type="submit">Login</button>
      </label>
      <label>
      <Link to="/">Sing up</Link>
      </label>
    </form>
  );
}

export default Login;
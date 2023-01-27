import React, { useState } from 'react';
import { Link } from 'react-router-dom';

interface Props {
  onSubmit: (formData: {email: string, password: string}) => void;
}

const Login: React.FC<Props> = (props) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    props.onSubmit({email, password});
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
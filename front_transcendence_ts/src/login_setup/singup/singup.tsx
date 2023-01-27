import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './singup.module.css';
import instance from '../../confs/axios_information';

const loginDTO = {
  email: 'your-email',
  password: 'your-password',
};

type dtotype = typeof loginDTO;

const PostSingup = async (dto: dtotype) => {
  instance.defaults.withCredentials = true;
  instance.post('/sing-up', dto)
  .then((response) => {
    console.log(response.data);
  })
  .catch((error) => {
    console.log(error);
  });
}

const Singup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [verify_password, setVerifyPassword] = useState('');

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (password === verify_password && password !== '' && email !== '')
    {
      loginDTO.email = email;
      loginDTO.password = password;
      PostSingup(loginDTO);
    }
    else
    {
      alert("Incorrect Information!");
    }
  }

  return (
    <form className={styles['form-container']} onSubmit={handleSubmit}>
      <label className={styles['form-label']}>
        Email:
        <input className={styles['form-input']} type="email" value={email} onChange={(event) => setEmail(event.target.value)} />
      </label>
      <label className={styles['form-label']}>
        Password:
        <input className={styles['form-input']} type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
      </label>
      <label className={styles['form-label']}>
        Verify Password:
        <input className={styles['form-input']} type="verify_password" value={verify_password} onChange={(event) => setVerifyPassword(event.target.value)} />
      </label>
      <br />
      <button className={styles['form-button']} type="submit">Create Account</button>
      <label>
      <Link to="/login">Login</Link>
      </label>
    </form>
  );
}

export default Singup;
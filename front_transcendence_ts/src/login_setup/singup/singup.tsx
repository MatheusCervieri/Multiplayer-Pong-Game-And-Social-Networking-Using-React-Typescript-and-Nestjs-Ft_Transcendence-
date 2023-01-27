import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './singup.module.css';
import instance from '../../confs/axios_information';
import { useNavigate } from 'react-router-dom';


const loginDTO = {
  email: 'your-email',
  password: 'your-password',
};

type dtotype = typeof loginDTO;


async function PostSingup2(dto: dtotype): Promise<number> {
  instance.defaults.withCredentials = true;
  try {
    const response = await instance.post('/sing-up', dto);
    console.log(response.data);
    return 0;
  } catch (error) {
    console.log(error);
    return 1;
  }
}


const Singup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [verify_password, setVerifyPassword] = useState('');
  const navigate = useNavigate();


  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (password === verify_password && password !== '' && email !== '')
    {
      loginDTO.email = email;
      loginDTO.password = password;
      const result = await PostSingup2(loginDTO);
      if (result === 0)
      {
        navigate('/setname');
      }
      else
      {
        alert("Error creating the account!");
      }
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
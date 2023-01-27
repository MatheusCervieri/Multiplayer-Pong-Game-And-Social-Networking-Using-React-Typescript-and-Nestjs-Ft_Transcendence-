import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './singup.module.css';

interface Props {
  onSubmit: (formData: {email: string, password: string, verify_password: string}) => void;
}

const Singup: React.FC<Props> = (props) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [verify_password, setVerifyPassword] = useState('');

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    props.onSubmit({email, password, verify_password});
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
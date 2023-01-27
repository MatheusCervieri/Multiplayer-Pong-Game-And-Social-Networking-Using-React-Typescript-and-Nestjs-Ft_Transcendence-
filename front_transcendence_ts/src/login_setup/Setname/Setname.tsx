import React, { useState } from 'react';
import styles from '../singup/singup.module.css'

interface Props {
  onSubmit: (formData: {name: string}) => void;
}

const Setname: React.FC<Props> = (props) => {
  const [name, setName] = useState('');

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    props.onSubmit({name});
  }

  return (
  <form className={styles['form-container']} onSubmit={handleSubmit}>
    <label className={styles['form-label']}>
    Choose your name:
    <input className={styles['form-input']} type="name" value={name} onChange={(event) => setName(event.target.value)} />
    </label>
    <button className={styles['form-button']} type="submit">Create Name!</button>
  </form>
  );
}

export default Setname;
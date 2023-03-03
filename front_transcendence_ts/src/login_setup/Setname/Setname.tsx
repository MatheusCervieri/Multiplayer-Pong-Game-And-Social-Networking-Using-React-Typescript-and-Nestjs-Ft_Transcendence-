import React, { useState } from 'react';
import styles from '../singup/singup.module.css'
import instance from '../../confs/axios_information';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';


const Setname = () => {
  const [name, setName] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const token = localStorage.getItem('token');
    instance.post('set-name', {
      name: name
    }, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(response => {
        console.log(response.data);
        if (response.data.status === 400)
        {
          toast.error("Name already taken, choose another one");
        }
        else
          navigate('/setprofileimage');
      })
      .catch(error => {
        console.error(error);
      });
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
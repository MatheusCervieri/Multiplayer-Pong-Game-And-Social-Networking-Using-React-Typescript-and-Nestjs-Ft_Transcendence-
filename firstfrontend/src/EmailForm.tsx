import React, { useState } from 'react';
import axios from 'axios'

function EmailForm() {
  const [email, setEmail] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = {
        email: email,
    }
    axios.post('http://localhost:3001/simple-post', data)
    .then(response => {
        console.log(response);
    })
    .catch(error => {
        console.log(error);
    });
    console.log(`Email: ${email}`);
    // send the email to the backend
    setEmail('');
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Email:
        <input type="email" value={email} onChange={e => setEmail(e.target.value)} />
      </label>
      <button type="submit">Submit</button>
    </form>
  );
}

export default EmailForm;

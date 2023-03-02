import React, { useState } from 'react';
import axios from 'axios';

export default function SendTwoFaCode() {
  const [code, setCode] = useState('');

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    try {
      const response = await axios.post('/auth/two-factor/send-code', { email: code });
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>
          Code:
          <input type="text" value={code} onChange={(event) => setCode(event.target.value)} />
        </label>
        <button type="submit">Send code</button>
      </form>
    </div>
  );
}

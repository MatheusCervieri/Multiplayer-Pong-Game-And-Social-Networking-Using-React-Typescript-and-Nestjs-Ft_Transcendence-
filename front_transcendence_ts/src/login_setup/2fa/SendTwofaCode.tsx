import instance from '../../confs/axios_information';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useState } from 'react';

const TwoFaForm = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const TwoFaLabel = styled.label`
  font-size: 1.2rem;
  margin-top: 1rem;
`;

const TwoFaInput = styled.input`
  font-size: 1.2rem;
  padding: 0.5rem;
  border: none;
  border-radius: 5px;
  margin-top: 0.5rem;
`;

const TwoFaButton = styled.button`
  font-size: 1.2rem;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 5px;
  margin-top: 1rem;
  background-color: #0077FF;
  color: #fff;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #0055FF;
  }
`;

export default function SendTwoFaCode() {
  const [code, setCode] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const name = searchParams.get('name');

  
  const handleSubmit = async (event: any) => {
    event.preventDefault();
   
    try {
      const data = 
      {
        name: name,
        code : code,
      }
      const response = await instance.post('/auth/2fa', data);
      
      
      localStorage.setItem('token', response.data.token);
      navigate('../dashboard');
    } catch (error : any) {
      
    }
  };

  return (
    <div>
      <TwoFaForm onSubmit={handleSubmit}>
        <TwoFaLabel>
          <center>
          Code:
          <br></br>
          <TwoFaInput type="text" value={code} onChange={(event : any) => setCode(event.target.value)} />
          </center>
        </TwoFaLabel>
        <TwoFaButton type="submit">Send code</TwoFaButton>
      </TwoFaForm>
    </div>
  );
}
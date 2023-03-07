import React, { useEffect } from 'react'
import { toast } from 'react-toastify';
import  instance from '../../confs/axios_information';
import styled from 'styled-components';
import { Navigate, useNavigate } from 'react-router-dom';

const TwoFaWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 32px;
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 16px;
`;

const Text = styled.p`
  margin-bottom: 5px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Label = styled.label`
  font-size: 18px;
  margin-bottom: 8px;
`;

const Input = styled.input`
  padding: 8px 16px;
  border-radius: 4px;
  margin-bottom: 16px;
`;

const Button = styled.button`
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
  padding: 8px 16px;
  margin-top: 16px;
  cursor: pointer;

  &:hover {
    background-color: #0056b3;
  }
`;

export default function TwoFa() {
  const [TwoFaStatus, setTwoFaStatus] = React.useState(false);
  const navigate = useNavigate();

  async function enable2FA(event: any)
  {
    const token = localStorage.getItem('token');
    event.preventDefault(); // prevent the default form submission

    const email = event.target.elements.email.value;
    console.log(email);
    try {
      const response = await instance.post('/userdata/enable-2fa', {email},  {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      console.log(response.data);
  
      console.log(response.data.status);
      if (response.data.status === 400) {
        toast.error(response.data.message)
      } 
      else
        toast.success("2fa enabled");
        navigate('myperfil');
        GetTwoFaStatus();
    } catch (error : any) {
      console.error(error);
  }
  }
  async function disable2FA()
  {
    const token = localStorage.getItem('token');
    try {
      const response = await instance.get('userdata/disable-2fa', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      console.log(response.data);
      toast.success("2fa disabled");
      GetTwoFaStatus();
      navigate('myperfil');
    } catch (error) {
      console.error(error);
    }
  }

  async function GetTwoFaStatus()
  {
    const token = localStorage.getItem('token');
    try {
      const response = await instance.get('userdata/2fastatus', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setTwoFaStatus(response.data);
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    GetTwoFaStatus();
  }, []);

  return (
    <>
    <TwoFaWrapper>
      <Title>{TwoFaStatus ? '2fa is enabled!' : '2fa is disabled!'}</Title>
      {!TwoFaStatus && <Text>Please, enter your email to enable 2fa!</Text>}
      <br>
      </br>
      {!TwoFaStatus && 
        <Form onSubmit={enable2FA}>
          <Label htmlFor="email">Email:</Label>
          <Input type="email" id="email" name="email" required />
          <Button type="submit">Enable 2fa</Button>
        </Form>
      }
      {TwoFaStatus && 
        <Button onClick={disable2FA}>Disable 2fa</Button>
      }
    </TwoFaWrapper>
    </>
  )
}

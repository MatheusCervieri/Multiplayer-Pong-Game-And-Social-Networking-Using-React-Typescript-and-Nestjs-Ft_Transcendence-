import React, { useEffect } from 'react'
import { OptionButton } from '../UserOptions';
import { useNavigate } from 'react-router-dom';
import  instance from '../../confs/axios_information';

interface DmProps {
    name: string;
    me: string
}

export default function DmBtn(props : DmProps) {
    const navigate = useNavigate();

  useEffect(() => {

  }, []);


  async function PostNewRoom(userdm: string): Promise<number>{
    try {
    const data = {
        name: userdm + props.me,
        adm: props.me,
        type: 'dm',
        password: '',
        users: [userdm , props.me]
    }
    const response = await instance.post('chatdata/create-room-dm', data );
    navigate('/chat/' + response.data.id);
    console.log(response.data);
    return 0;
    } catch (error) {
    console.log(error);
    return 1;
    }
  }
    function handleBtn(){
      PostNewRoom(props.name);
      console.log("Profile button clicked");
    }


  return (
    <>
    <div><OptionButton onClick={handleBtn}>DM </OptionButton></div>
    </>
  )
}

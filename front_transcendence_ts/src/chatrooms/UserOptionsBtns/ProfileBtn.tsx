import React, { useEffect } from 'react'
import { OptionButton } from '../UserOptions';
import { useNavigate } from 'react-router-dom';


interface ProfileProps {
    name: string;
}



export default function ProfileBtn(props : ProfileProps) {
    const navigate = useNavigate();

  useEffect(() => {

  }, []);

    function handleProfileBtn(){
        const encodedName = encodeURIComponent(props.name);
        navigate('/profile/' + encodedName + '/');
    }


  return (
    <>
    <div><OptionButton onClick={handleProfileBtn}>Profile</OptionButton></div>
    </>
  )
}

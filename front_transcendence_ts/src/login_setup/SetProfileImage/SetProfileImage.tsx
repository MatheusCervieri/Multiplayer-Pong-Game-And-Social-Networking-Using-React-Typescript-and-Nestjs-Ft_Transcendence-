import React, { useState, ChangeEvent, FormEvent } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import instance from '../../confs/axios_information';

const SetProfileImage: React.FC = () => {
  const [image, setImage] = useState<File | null>(null);
  const navigate = useNavigate();

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setImage(event.target.files[0]);
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    event.preventDefault();

    if (!image) {
      return;
    }

    const formData = new FormData();
    formData.append('image', image);

    const token = localStorage.getItem('token');

    try {

      const response = await instance.post('/image/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      });

      console.log(response.data);
      if(response.data.statusCode === 200)
      {
        toast.success(response.data.message);
        navigate('/dashboard');
      }
      if(response.data.error.status === 400)
      {
        toast.error(response.data.message);
      }
    } catch (error) {
     
    }
  };
  
  async function getfiles()
  {
    const token = localStorage.getItem('token');
    try {
        const response = await instance.get('/image/profileimage/' + 72, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`
          }
          ,
          responseType: 'blob' // set the responseType to 'blob' to get the image data as a blob object
        });
        console.log("Response", response);
       
      }  catch (error : any) {
        console.log("Error");
      }
    };

    
    
    
    
    

  
  return (
    <>
    <form onSubmit={handleSubmit}>
      <input type="file" onChange={handleImageChange} />
      <button type="submit">Upload Image</button>
    </form>
    <button onClick={getfiles}>Get files</button>
    <img src="http://localhost:3001/publicimage/profileimage/72" alt="User profile image"></img>
    </>
  );
};

export default SetProfileImage;

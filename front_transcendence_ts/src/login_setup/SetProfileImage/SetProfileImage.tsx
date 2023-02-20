import React, { useState, ChangeEvent, FormEvent } from 'react';
import instance from '../../confs/axios_information';

const SetProfileImage: React.FC = () => {
  const [image, setImage] = useState<File | null>(null);

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
    } catch (error) {
      console.error(error);
    }
  };
  
  async function getfiles()
  {
    const token = localStorage.getItem('token');
    try {
        const response = await instance.get('/image/all', {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`
          }
        });
        console.log(response.data);
      } catch (error) {
        console.error(error);
      }
    };

  
  return (
    <>
    <form onSubmit={handleSubmit}>
      <input type="file" onChange={handleImageChange} />
      <button type="submit">Upload Image</button>
    </form>
    <button onClick={getfiles}>Get files</button>
    </>
  );
};

export default SetProfileImage;

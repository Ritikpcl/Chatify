import React, { useEffect, useState } from 'react';
import { HashLoader } from 'react-spinners';
import Swal from 'sweetalert2'

const ImageGen = ({ prompt, setPreview, setImage, setImageGen }) => {
  const [loading, setLoading] = useState(false)
  
  const Alert=(message)=>{
    Swal.fire({
      position: 'center',
      icon: 'warning',
      title: message,
      showConfirmButton: false,
      timer: 3000,
      width:250,
    })
  }

  useEffect(() => {
    if(!prompt) {
      Alert("Please enter a message");
      setPreview(false)
      setImageGen(false)
      return;
    }

    if (prompt.split(' ').length > 20) {
      setPreview(false);
      Alert("Please enter a message with fewer than 20 words.");
      return;
    }

    if (prompt.split(' ').some(word => word.length > 7)) {
      setPreview(false);
      Alert("Please provide words that have less than 7 characters.")
      return;
    }
    
    const fetchData = async () => {
      try {
            setLoading(true)
            setImage(null)
            const response = await fetch(
              `${import.meta.env.VITE_IMAGE_GEN_URL}`,
                {
                    headers: { Authorization: `Bearer ${import.meta.env.VITE_IMAGE_GEN_API}` },
                    method: "POST",
                    body: JSON.stringify(prompt),
                }
            );
            const result = await response.blob();
            console.log(result)
            setPreview(false)
            setLoading(false)
            setImageGen(false)
            setImage(result)
      } catch (error) {
        console.error(error);
        setPreview(false)
        setLoading(false)
        setImageGen(false)
      }
    }
    fetchData();
  }, []);

  return (
    <div className='containerWrap fixed bottom-[90px] p-5 pb-0 '>
        {
          loading && <div className="containerWrap fixed bottom-[90px] p-5 pb-0 flex justify-center">
            <div className="w-auto backdrop-blur-md bottom-0 bg-white/30 p-5 rounded-xl relative ">
          <HashLoader
          color={'#36454F'} 
          size={100}
          />
          </div>
          </div>
        }
      </div>
  );
};

export default ImageGen;

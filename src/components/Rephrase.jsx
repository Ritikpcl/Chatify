import React, { useEffect, useState } from 'react';
import { SyncLoader } from 'react-spinners';
import copy from '../assets/copy.png'
import expandUp from '../assets/expandUp.png'
import expandDown from '../assets/expandDown.png'
import Swal from 'sweetalert2'

const Rephrase = ({ data, setValue, setPreview}) => {
  const [editValue, setEditValue] = useState('');
  const [viewMore, setViewMore] = useState(false)
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

    if(!data) {
      Alert("Please enter a message");
      setPreview(false)
      return;
    }

    if (data.split(' ').length > 20) {
      setPreview(false);
      Alert("Please enter a message with fewer than 20 words.");
      return;
    }

    if (data.split(' ').some(word => word.length > 7)) {
      setPreview(false);
      Alert("Please provide words that have less than 7 characters.")
      return;
    }

    setLoading(true)

    const fetchData = async () => {
    try {
      console.log("useeffect")
        const response = await fetch(
          `${import.meta.env.VITE_REPHRASE_TEXT_URL}`,
          {
            headers: { Authorization: `Bearer ${import.meta.env.VITE_REPHRASE_TEXT_API}` },
            method: "POST",
            body: JSON.stringify(data),
          }
        );
        const result = await response.json();
        console.log(result)
        setEditValue(result[0].generated_text);
        setLoading(false)
      } catch (error) {
        console.error(error);
        setLoading(false)
      }
    }
    fetchData();
  }, []);

  const handleImport = () => {
    setPreview(false);
    setValue(editValue);
  };

  return (
    <div className='containerWrap fixed bottom-[54px] p-5'>
      <div className='relative mr-5 mb-2 ml-8'
        style={{
          height: viewMore ? '200px' : '70px',
          transition: 'height 0.3s ease',
          transformOrigin: 'bottom',
        }}>

        <button onClick={() => setViewMore(prev => !prev)} className='h-4 w-4 m-1 absolute'>

          {viewMore ? <img className="w-8" src={expandDown}/> : <img src={expandUp} className='w-8'/>}
        </button>
        {
          loading ? <div className='w-full bg-[#30363c] text-gray-400 rounded-b-none p-4 h-full resize-none overflow-y-auto pl-8'>
          <SyncLoader
          color={'#71797E'} 
          size={7}
          />
          </div> :

          <textarea
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          className="input w-full focus:outline-none bg-[#30363c] text-gray-400 rounded-t-xl p-4 h-full resize-none overflow-y-auto"
          type="text"
        />
        }
      
        <button
          onClick={handleImport}>
          <img className=" absolute top-[10px] right-1 w-8 px-2" src={copy}/>
        </button>
      </div>
    </div>
  );
};

export default Rephrase;

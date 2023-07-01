import React, { useEffect, useState } from 'react';
import copy from '../assets/copy.png'
import expandUp from '../assets/expandUp.png'
import expandDown from '../assets/expandDown.png'
import { SyncLoader } from 'react-spinners';
import axios from 'axios'
import Swal from 'sweetalert2'

const Bot = ({ prompt, setValue, setPreview }) => {
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

    if (!prompt) {
      Alert("Please enter message");
      setPreview(false)
      return;
    }

    if (prompt.split(' ').length > 20) {
      setPreview(false);
      Alert("Please enter a message with fewer than 20 words.");
      return;
    }

    if (prompt.split(' ').some(word => word.length > 7)) {
      setPreview(false);
      Alert("Please provide words that have less than seven characters.")
      return;
    }

    const fetchData = async () => {
      try {

        setLoading(true)
        console.log("useeffect")

        //OpenAI api
        const options = {
          method: 'POST',
          url: `${import.meta.env.VITE_OPEN_AI_TEXT_URL}`,
          headers: {
            authorization: `Bearer ${import.meta.env.VITE_OPEN_AI_TEXT_API}`
          },
          data: {
            providers: 'openai',
            text: prompt,
            temperature: 0.2,
            max_tokens: 70
          }
        };

        const response = await axios.request(options)
        console.log(response.data.openai.generated_text);
        var text = response.data.openai.generated_text;
        text = text.replace(/^\n+/, "")
        console.log(text)
        setEditValue(text)
        setLoading(false)
      } catch (error) {
        console.error(error);

        try {
          //Alternate Api when OpenAi api is not responding
          const response = await fetch(
            `${import.meta.env.VITE_ALTERNATE_TEXT_URL}`,
            {
              headers: { Authorization: `Bearer ${import.meta.env.VITE_ALTERNATE_TEXT_API}`},
              method: "POST",
              body: JSON.stringify(prompt),
            }
          );

          const result = await response.json();
          console.log(result)
          setEditValue(result[0]?.generated_text);
          setLoading(false)
        } catch (error) {
          setEditValue("API is not responding. Please try again later.")
          setLoading(false)
        }
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
      <div className='relative mr-5 mb-2 ml-8 bg-[#30363c] text-gray-400'
        style={{
          height: viewMore ? '200px' : '70px',
          transition: 'height 0.3s ease',
          transformOrigin: 'bottom',
        }}>

        <button onClick={() => setViewMore(prev => !prev)} className='h-4 w-4 m-1 absolute'>
          {viewMore ? <img className="w-8" src={expandDown} /> : <img src={expandUp} className='w-8' />}
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

        <button onClick={handleImport}>
          <img className=" absolute top-[10px] right-1 w-8 px-2" src={copy} />
        </button>
      </div>

    </div>
  );
};

export default Bot;

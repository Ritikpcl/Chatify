import { useEffect, useState } from "react";
import { UserAuth } from "../context/AuthContext";
import { getDownloadURL, ref } from "firebase/storage";
import { storage } from "../firebase";
import { SyncLoader } from 'react-spinners';

const Message = ({ message }) => {
  const { currentUser } = UserAuth();
  const [imgUrl, setImgUrl] = useState("");
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    if (message?.imgUrl) {
      const imageRef = ref(storage, message.imgUrl);
      getDownloadURL(imageRef).then((url) => setImgUrl(url));
    }
    setLoading(false)
  }, [message?.imgUrl]);

  if (loading) {
    return( <div className='w-full bg-gray-700 rounded-b-none p-4 h-full resize-none overflow-y-auto pl-8'>
      <SyncLoader
        color={'#71797E'}
        size={7}
      />
    </div>)
  }

  return (
    <div>
      <div className={`chat ${message.uid === currentUser.uid ? "chat-end" : "chat-start"}`}>
        <div className="chat-image avatar">
          <div className="w-10 rounded-full">
            <img src={message.avatar} alt="User Avatar" />
          </div>
        </div>
        <div className="chat-header">{message.name}</div>
        {message.text && <div className="chat-bubble py-2 w-60 bg-[#1A1A1A] "
          style={{
            wordBreak: 'break-word', whiteSpace: 'pre-wrap',
            MozWhiteSpace: 'pre-wrap'
          }}>
          {message.text}
        </div>}
        {message?.imgUrl && (
          <div className="chat-bubble chat-image w-60">
            <img src={imgUrl} alt="Message Image" />
          </div>
        )}
      </div>
    </div>
  );
};

export default Message;

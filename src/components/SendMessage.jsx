import { getStorage, ref, uploadBytes } from "firebase/storage";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { useState } from "react";
import { UserAuth } from "../context/AuthContext";
import { db } from "../firebase";
import Bot from "./Bot";
import Rephrase from "./Rephrase";
import BsendIcon from '../assets/Bsend.png'
import close from '../assets/close.png'
import Bclose from '../assets/Bclose.png'
import chatbot from '../assets/chatbot.png'
import circle from '../assets/circle.png'
import uimage from '../assets/uimage.png'
import magic from '../assets/magic.png'
import Emozy from "../assets/emozy.png";
import Bmenu from "../assets/Bmenu.png";
import ImageGen from "./ImageGen";
// import data from "@emoji-mart/data";
// import Picker from "@emoji-mart/react";



const SendMessage = () => {
  const [value, setValue] = useState("");
  const [preview, setPreview] = useState(false);
  const { currentUser } = UserAuth();
  const [rephrase, setRephrase] = useState(false);
  const [imageGen, setImageGen] = useState(false);
  const [ShowEmozy, setShowEmozy] = useState(false);
  const [openIcon, setOpenIcon] = useState(false)
  const [image, setImage] = useState(null);

  const handleSendMessage = async (e) => {

    e.preventDefault();

    if (preview) return;

    if (value.trim() === "" && !image) {
      alert("Enter valid message!");
      return;
    }

    try {
      const { uid, displayName, photoURL } = currentUser;

      // Upload the image to Firebase Storage if it exists
      if (image) {
        const storage = getStorage();
        const imageRef = ref(storage, `uploads/images/${Date.now()}-${image.name}`);
        const uploadResult = await uploadBytes(imageRef, image);
        await addDoc(collection(db, "messages"), {
          imgUrl: uploadResult.ref.fullPath,
          name: displayName,
          avatar: photoURL,
          createdAt: serverTimestamp(),
          uid
        })
        console.log("image")
      }

      // Store the message to Firebase Storage if it exists
      if (value) {
        await addDoc(collection(db, "messages"), {
          text: value,
          name: displayName,
          avatar: photoURL,
          createdAt: serverTimestamp(),
          uid,
        });
      }

    } catch (error) {
      console.log(error);
    }

    setValue("");
    setPreview(false);
    setRephrase(false);
    setImage(null); 
  };

  const handleClose = () => {
    setImage(null)
    setImageGen(false)
  }

  const handleOpenIcon=()=>{
    if(image) setImage(null)
    if(imageGen) setImageGen(false)
    if(ShowEmozy) setShowEmozy(false)
    if(preview) setPreview(false)
    if(rephrase) setRephrase(false)
    setOpenIcon((prev)=>!prev)
  }

  const addEmoji = (e) => {
    const sym = e.unified.split("_");
    const codeArray = [];
    sym.forEach((el) => codeArray.push("0x" + el));
    let emoji = String.fromCodePoint(...codeArray);
    setValue(value + emoji);
  };

  return (
    <div className="bg-gray-200 text-gray-500 fixed  bottom-0 w-full py-4 shadow-lg">
      <div className="px-2 containerWrap flex flex-col relative">

        <button onClick={handleOpenIcon} className="absolute top-2 ">
          {openIcon ? <img className="w-12 px-2" src={Bclose} /> : <img className="w-12 px-2" src={Bmenu} />}
        </button>

        {/* Normal input message */}
        <div className="flex items-center h-auto">
          <textarea
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="input w-full focus:outline-none bg-gray-100 rounded-r-none resize-none pt-3 overflow-y-auto px-12"
            style={{ height: '50px', maxHeight: '200px', minHeight: '50px' }}
            type="text"
          />

          {/* send button */}
          <button onClick={handleSendMessage} className="absolute top-1 right-1">
            <img className="w-10 mx-2" src={BsendIcon} />
          </button>

        </div>

        {/*Menu section*/}
        <div className="flex containerWrap fixed mt-2 flex-col" style={{
          bottom: openIcon ? '90px' : '-300px',
          transition: 'bottom 0.5s ease',
          transformOrigin: 'bottom',
        }}>

          {/* chatBot */}
          <button onClick={() => setPreview((prev) => !prev)} className="menu-btn rounded-t-xl">
            {preview ? <img className="w-12 px-2" src={close} /> : <img className="w-12 px-2" src={chatbot} />}
          </button>
          {preview && <Bot prompt={value} setValue={setValue} preview={preview} setPreview={setPreview} />}

          {/* Rephrase message */}
          <button onClick={() => setRephrase((prev) => !prev)} className="menu-btn">
            {rephrase ? <img className="w-12 px-2" src={close} /> : <img className="w-12 px-2" src={circle} />}
          </button>
          {rephrase && <Rephrase data={value} setValue={setValue} preview={rephrase} setPreview={setRephrase} />}

          {/* Image Generate */}
          <button onClick={() => setImageGen((prev) => !prev) } className="menu-btn">{
            imageGen ? <img className="w-12 px-2" src={close} /> : <img className="w-12 px-2" src={magic} />}
          </button>
          {imageGen && <ImageGen prompt={value} setPreview={setPreview} setImage={setImage} setImageGen={setImageGen} />}

          {/* Image file input */}
          <label htmlFor="fileInput" className="input-button">
          <div className="menu-btn">
            <img className="w-12 px-2" src={uimage} alt="Upload" />
          </div>
          </label>
          <input id="fileInput" className="hidden" type="file" onChange={(e) => setImage(e.target.files[0])} />
          {(image && !preview && !rephrase) && (
            <div className="containerWrap fixed bottom-[90px] p-5 pb-0 flex justify-center">
              <div className="w-auto backdrop-blur-md bg-white/30 p-5 rounded-xl relative">
                <img className="object-cover w-60" src={URL.createObjectURL(image)} alt="preview" />
                <button onClick={handleClose} className="absolute top-1 right-1">
                  <img src={close} className="w-6" />
                </button>
              </div>
            </div>
          )}

          {/* Emozy-section */}
          <button onClick={()=>setShowEmozy((prev) => !prev)} className="menu-btn rounded-b-xl">
            {ShowEmozy ? <img className="w-12 px-2" src={close} /> : <img className="w-12 px-2" src={Emozy} />}
          </button>
          {
            ShowEmozy && (<div className="containerWrap pl-12 fixed bottom-[90px]">
              <Picker
                data={data}
                emojiSize={20}
                onEmojiSelect={addEmoji}
                previewPosition="none"
                perLine={8}
              />
              </div>)
          }
        </div>
      </div>

    </div>
  );
};

export default SendMessage;

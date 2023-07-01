import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserAuth } from "../context/AuthContext";
import Lottie from 'react-lottie';
import animationData from '../assets/conversation.json';
import Google from '../assets/google.png'

const Login = () => {
  const navigate = useNavigate();
  const { currentUser, signinWithGoogle } = UserAuth();

  const handleLogin = async () => {
    try {
      await signinWithGoogle();
    } catch(error) {
      console.log(error)
    }
  }

  useEffect(() => {
    if(currentUser) {
      navigate("/chat")
    }
  }, [currentUser]);

  const options = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
        preserveAspectRatio: "xMidYMid slice"
    }
};

  return (
    <div className="hero min-h-screen bg-[#262626]">
      <div className="hero-content text-center">
        <div className="max-w-md fext flex-col items-center">
          <div><Lottie
          options={options}
          speed={2}
          height={200}
          width={200}
      /></div>
          <p className="py-6">
          Unlock the Potential of Chatting with AI-Powered Conversations
          </p>
            <div className="flex items-center justify-center"> 
            <img src={Google} className="w-16"/>
            <button onClick={handleLogin} className=" btn bg-transparent border-zinc-400 normal-case">
            Login With Google</button>
            </div>
          </div>
      </div>
    </div>
  );
};

export default Login;

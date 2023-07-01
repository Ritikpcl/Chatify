import { UserAuth } from "../context/AuthContext";
import Lottie from 'react-lottie';
import animationData from '../assets/customer-service-chat.json';
import BLogout from '../assets/Blogout.png'

const Navbar = () => {
  const { currentUser, logout } = UserAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch(error) {
      console.log(error);
    }
  }

  const options = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
        preserveAspectRatio: "xMidYMid slice"
    }
};

  return (
    <div className="navbar h-16 fixed z-10 bg-gray-200 text-neutral-content">
      <div className="containerWrap flex justify-between">
      <div>
      <Lottie
          options={options}
          speed={1}
          height={60}
          width={60}
      />
      </div>
      <h1 className="font-semibold text-3xl text-[#262626]">Chatify</h1>
        {currentUser ? <button onClick={handleLogout}>
          <img className="w-12 px-2" src={BLogout}/>
        </button> : <div></div>}
      </div>
    </div>
  );
}

export default Navbar;

import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import { validUser } from "../components/recoil";
import { jwtDecode } from "jwt-decode";



interface DecodedToken{
  name:string,
  email:string,
  userId:string,
  Level:string
} 
export const Play = () => {
  
  const [isValid, setisValid] = useRecoilState(validUser);
  const navigate = useNavigate();

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const token = queryParams.get('verified');
    console.log("TOKEN!! : ", token);
    if (token) {
      localStorage.setItem("token", token);
      const decode=jwtDecode<DecodedToken>(token);
      const userName=decode.name;
      const userId=decode.userId
      setisValid({isValid:true,name:userName,userId:Number(userId)});
    } else {
      navigate("/signup");
    }
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-800 via-gray-700 to-gray-900 p-6">
      <div className="flex flex-col items-center space-y-6 p-8 bg-gray-800 bg-opacity-90 backdrop-blur-lg rounded-xl shadow-2xl border border-gray-700">
        <h1 className="text-3xl font-bold text-yellow-400 tracking-wider mb-6">Adventure Awaits</h1>
        
        <Link 
          to='/newgame' 
          className="w-48 py-3 text-center bg-yellow-600 text-white font-semibold rounded-md shadow-lg hover:bg-yellow-500 transform hover:scale-105 transition-all duration-200"
        >
          Start New Adventure
        </Link>

        <Link 
          to='/resume' 
          className="w-48 py-3 text-center bg-green-700 text-white font-semibold rounded-md shadow-lg hover:bg-green-600 transform hover:scale-105 transition-all duration-200"
        >
          Resume Journey
        </Link>

        <Link 
          to='/leaderboard' 
          className="w-48 py-3 text-center bg-blue-700 text-white font-semibold rounded-md shadow-lg hover:bg-blue-600 transform hover:scale-105 transition-all duration-200"
        >
          Hall of Fame
        </Link>

        <Link 
          to='/complevel' 
          className="w-48 py-3 text-center bg-purple-700 text-white font-semibold rounded-md shadow-lg hover:bg-purple-600 transform hover:scale-105 transition-all duration-200"
        >
          Completed Levels
        </Link>
      </div>
    </div>
  );
};

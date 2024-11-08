import { useState } from "react";
import SignInButton from "../SignInButton";
import { useNavigate } from "react-router-dom";
import { VerifyOtp } from "./VerifyOtp";
import axios, { AxiosError } from "axios";
import { jwtDecode } from "jwt-decode";
import { useRecoilState,  } from "recoil";
import { validUser } from "../components/recoil";


interface SignupResponse {
  token: string; 
}

interface DecodedToken{
  name:string,
  email:string,
  userId:string,
  Level:string
}
export const Signin = () => {

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const navigate=useNavigate();
  const [verify,setVerify]=useState<boolean>(false);
  const [isValid ,setisValid]=useRecoilState(validUser);  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      
      const res = await axios.post<SignupResponse>("http://localhost:3000/auth/local", {
        email,
        password,
      });

      const token=res.data.token;
      console.log(token);
      localStorage.setItem("token",token);
      const decode=jwtDecode<DecodedToken>(token);
     const userName=decode.name;
     const userId=decode.userId;
      setisValid({isValid:true,name:userName,userId:Number(userId)});
      navigate(`/play?verified=${encodeURIComponent(isValid.isValid)}&userName=${encodeURIComponent(userName)}`);
    } catch (error:Error | AxiosError) {
        
        if (error.response) {
          if(error.response.status==409){
            setVerify(true);
          }
          if(error.response.status==400){
            navigate("/signup");
          }
        }

      }
  };


  return (
    verify ? (
      <VerifyOtp email={email} />
    ) :(
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md border border-gray-300 rounded-lg shadow-lg bg-white p-10">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Sign In</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)} // Update email state
              placeholder="Enter your email"
              className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)} // Update password state
              placeholder="Enter your password"
              className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full p-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300"
          >
            Submit
          </button>
        </form>
        <div className="flex justify-center items-center mt-4">
          <SignInButton />
        </div>
      </div>
    </div>)
  );
};

import axios from 'axios';
import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { useSetRecoilState } from 'recoil';
import { validUser } from '../components/recoil';

interface SignupResponse {
    token: string; 
}

interface DecodedToken{
  name:string,
  email:string,
  userId:string,
  Level:string
}

export const VerifyOtp = ( {email}:{email:String} ) => {

const [otp, setOtp] = useState('');
const navigate=useNavigate();
const setisValid=useSetRecoilState(validUser);

  const handleSubmit = async (e:FormEvent) => {
    e.preventDefault();
  try {
   const res= await axios.get<SignupResponse>(`http://localhost:3000/auth/verifyOtp/${otp}`,{
        params: {
            email: email
        }
    })
    const token=res.data.token;
    console.log(token);
    localStorage.setItem("token",token);
    const decode=jwtDecode<DecodedToken>(token);
    const userName=decode.name;
    const verified=true;
    setisValid({isValid:true,name:userName,userId:Number(decode.userId)});
    navigate(`/play?verified=${encodeURIComponent(verified)}&userName=${encodeURIComponent(userName)}`);
  } catch (error) {
    console.log(error);
  }  

  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md border border-gray-300 rounded-lg shadow-lg bg-white p-10">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Verify OTP</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="otp" className="block text-sm font-medium text-gray-700">
              Enter OTP
            </label>
            <input
              id="otp"
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)} // Update OTP state
              placeholder="Enter your OTP"
              className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full p-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300"
          >
            Verify
          </button>
        </form>
      </div>
    </div>
  );
};

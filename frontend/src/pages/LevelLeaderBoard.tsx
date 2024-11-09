import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

interface Winner {
  user:user;
  bestSPI: number;
}
interface user{
    name:string
}

export const LevelLeaderboard = () => {
  const [winners, setWinners] = useState<Winner[]>([]);
    const navigate=useNavigate();
    const { levelName } = useParams();

  useEffect(() => {
    const fetchWinners = async () => {
      try {
        const res = await axios.get<Winner[]>(`http://localhost:3000/level-leaderboard/${levelName}`,{
            headers:{
                Authorization: localStorage.getItem("token") || ""
            }
        });
        console.log(res.data);
        setWinners(res.data);
      } catch (e) {
        console.error("Failed to fetch winners:", e);
        navigate('/signup');
      }
    };
        
    fetchWinners();
  }, []);

  return (
    <>
    <div className="flex flex-col items-center p-6 bg-gradient-to-br from-gray-800 via-gray-700 to-gray-900 min-h-screen">
     <h1 className="text-4xl font-bold text-yellow-400 mb-12">Leaderboard</h1>
        {winners.length > 0 ? (
        <div className="space-y-4 w-full max-w-4xl">
            {winners.map((winner, index) => (
            <div
                key={index}
                className="flex justify-between items-center bg-gray-800 bg-opacity-90 rounded-lg shadow-lg p-8 w-full text-left transform hover:scale-105 transition-transform duration-200"
            >
                <h2 className="text-2xl font-semibold text-yellow-300">{winner.user.name}</h2>
                <p className="text-xl text-gray-300">
                SPI: <span className="font-bold">{winner.bestSPI}</span>
                </p>
            </div>
            ))}
        </div>
        ) : (
        <p className="text-gray-300 font-medium text-lg mt-8">
            No winners yet! Play to be the first.
        </p>
        )}
         <Link 
  to={'/game'}
  className="mt-12 inline-block py-2 px-6 bg-yellow-400 text-gray-900 font-semibold text-xl rounded-lg shadow-lg hover:bg-yellow-500 transition-all duration-300"
>
  Play Next Level
</Link>
<Link 
  to={'/'}
  className="mt-4 inline-block py-2 px-6 bg-gray-800 text-yellow-400 font-semibold text-xl rounded-lg shadow-lg hover:bg-gray-700 transition-all duration-300"
>
  Go to Home
</Link>

  </div>

 
  </>

  );
};

import axios from "axios";
import { useEffect, useState } from "react";

interface Winner {
  name: string;
  CPI: number;
}

export const Leaderboard = () => {
  const [winners, setWinners] = useState<Winner[]>([]);

  // Function to generate random winners for testing
  // const generateRandomWinners = () => {
  //   const randomWinners: Winner[] = Array.from({ length: 6 }, (_, i) => ({
  //     name: `Player ${i + 1}`,
  //     CPI: Math.floor(Math.random() * 100) + 1,
  //   }));
  //   setWinners(randomWinners);
  // };

  useEffect(() => {
    const fetchWinners = async () => {
      try {
        const res = await axios.get<Winner[]>("http://localhost:3000/leaderboard");
        setWinners(res.data);
      } catch (e) {
        console.error("Failed to fetch winners:", e);
      }
    };
        // generateRandomWinners(); // Use random data for testing in case of an error

    fetchWinners();
  }, []);

  return (
    <div className="flex flex-col items-center p-6 bg-gradient-to-br from-gray-800 via-gray-700 to-gray-900 min-h-screen">
    <h1 className="text-4xl font-bold text-yellow-400 mb-12">Leaderboard</h1>
    {winners.length > 0 ? (
      <div className="space-y-4 w-full max-w-4xl">
        {winners.map((winner, index) => (
          <div
            key={index}
            className="flex justify-between items-center bg-gray-800 bg-opacity-90 rounded-lg shadow-lg p-8 w-full text-left transform hover:scale-105 transition-transform duration-200"
          >
            <h2 className="text-2xl font-semibold text-yellow-300">{winner.name}</h2>
            <p className="text-xl text-gray-300">
              CPI: <span className="font-bold">{winner.CPI}</span>
            </p>
          </div>
        ))}
      </div>
    ) : (
      <p className="text-gray-300 font-medium text-lg mt-8">
        No winners yet! Play to be the first.
      </p>
    )}
  </div>
  );
};

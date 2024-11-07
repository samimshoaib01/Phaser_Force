import axios from "axios";
import { useEffect, useState } from "react";

interface Winner {
  name: string;
  CPI: number;
}

export const Leaderboard = () => {
  const [winners, setWinners] = useState<Winner[]>([]);

  useEffect(() => {
    const fetchWinners = async () => {
      try {
        const res = await axios.get<Winner[]>("http://localhost:3000/leaderboard");
        setWinners(res.data);
      } catch (e) {
        console.error("Failed to fetch winners:", e);
      }
    };

    fetchWinners();
  }, []);

  return (
    <div className="flex flex-col items-center p-6 bg-gray-100 min-h-screen">
      {winners.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {winners.map((winner, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-lg p-6 max-w-xs w-full text-center transform hover:scale-105 transition-transform duration-200 ease-in-out"
            >
              <h2 className="text-xl font-semibold text-gray-800">{winner.name}</h2>
              <p className="text-gray-600">CPI: {winner.CPI}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-700 font-medium text-lg mt-8">
          No winners yet! Play to be the first.
        </p>
      )}
    </div>
  );
};

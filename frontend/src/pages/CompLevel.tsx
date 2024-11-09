import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface Levels {
    levelName: string;
    SPI: number;
    bestSPI: number;
    isComp: boolean;
}

// Function to generate random test data
// const generateTestData = (count: number): Levels[] => {
//     return Array.from({ length: count }, (_, i) => ({
//         levelName: `Level ${i + 1}`,
//         SPI: Math.floor(Math.random() * 100),      // Random SPI value between 0 and 100
//         bestSPI: Math.floor(Math.random() * 100),  // Random bestSPI value between 0 and 100
//         isComp: Math.random() > 0.5                // Randomly true or false
//     }));
// };

export const CompLevel = () => {
    const [levels, setLevels] = useState<Levels[]>([]);
    const navigate=useNavigate();

    useEffect(() => {
        // Uncomment the following line to use axios request in real use-case
        const fun = async () => {
            try {
                const res = await axios.get<Levels[]>("http://localhost:3000/complevel", {
                    headers: {
                        Authorization: localStorage.getItem("token") || ''
                    }
                });
                setLevels(res.data);
            } catch (error) {
                navigate("/signin");
            }
        };
        fun();

        // Using test data instead of actual API call for testing
        // setLevels(generateTestData(5)); // Generates 5 random levels

    }, [ ]);

    // Find the first incomplete level
    const firstIncompleteLevelIndex = levels.findIndex(level => !level.isComp);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-800 via-gray-700 to-gray-900 p-6">
        <h2 className="text-3xl font-bold text-yellow-400 text-center mb-8">Completed Levels</h2>
        <div className="space-y-6 max-w-3xl mx-auto">
            {levels.map((level, index) => (
                <div 
                    key={index} 
                    className="p-6 bg-gray-800 bg-opacity-90 rounded-lg shadow-lg border border-gray-700 transform hover:scale-105 transition-transform duration-200"
                >
                    <p className="text-xl font-semibold text-yellow-400 mb-2">
                        {level.levelName} 
                        {index === firstIncompleteLevelIndex && !level.isComp && (
                            <span className="ml-2 text-blue-500 font-bold">(Current Level)</span>
                        )}
                    </p>
                    <p className="text-gray-300">SPI: <span className="font-bold">{level.SPI}</span></p>
                    <p className="text-gray-300">Best SPI: <span className="font-bold">{level.bestSPI}</span></p>
                    <p className="text-gray-300">
                        Status:{" "}
                        <span className={level.isComp ? "text-green-500 font-bold" : "text-red-500 font-bold"}>
                            {level.isComp ? "Completed" : "Not Completed"}
                        </span>
                    </p>
                </div>
            ))}
        </div>
    </div>
    );
};

import { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { validUser } from "../components/recoil";
import { useNavigate } from "react-router-dom";
import axios from "axios";

interface Levels {
    levelName: string;
    SPI: number;
    bestSPI: number;
    isComp: boolean;
}

// Function to generate random test data
const generateTestData = (count: number): Levels[] => {
    return Array.from({ length: count }, (_, i) => ({
        levelName: `Level ${i + 1}`,
        SPI: Math.floor(Math.random() * 100),      // Random SPI value between 0 and 100
        bestSPI: Math.floor(Math.random() * 100),  // Random bestSPI value between 0 and 100
        isComp: Math.random() > 0.5                // Randomly true or false
    }));
};

export const CompLevel = () => {
    const isvalid = useRecoilValue(validUser);
    const navigate = useNavigate();
    const [levels, setLevels] = useState<Levels[]>([]);

    useEffect(() => {
        if (!isvalid) {
            navigate("/signup");
        }

        // Uncomment the following line to use axios request in real use-case
        // const fun = async () => {
        //     try {
        //         const res = await axios.get<Levels[]>("http://localhost:3000/complevel", {
        //             headers: {
        //                 Authorization: localStorage.getItem("token") || ''
        //             }
        //         });
        //         setLevels(res.data);
        //     } catch (error) {
        //         navigate("/signin");
        //     }
        // };

        // Using test data instead of actual API call for testing
        setLevels(generateTestData(5)); // Generates 5 random levels

    }, [isvalid, navigate]);

    // Find the first incomplete level
    const firstIncompleteLevelIndex = levels.findIndex(level => !level.isComp);

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <h2 className="text-2xl font-bold text-center mb-6">CompLevel</h2>
            <div className="space-y-4">
                {levels.map((level, index) => (
                    <div key={index} className="p-4 bg-white rounded-lg shadow-md border border-gray-200">
                        <p className="text-lg font-semibold text-gray-800">
                            Level Name: {level.levelName}{" "}
                            {index === firstIncompleteLevelIndex && !level.isComp && (
                                <span className="text-blue-600 font-bold">(Current Level)</span>
                            )}
                        </p>
                        <p className="text-gray-700">SPI: {level.SPI}</p>
                        <p className="text-gray-700">Best SPI: {level.bestSPI}</p>
                        <p className="text-gray-700">
                            Is Completed: <span className={level.isComp ? "text-green-600 font-bold" : "text-red-600"}>{level.isComp ? "Yes" : "No"}</span>
                        </p>
                        {level.isComp && <p className="text-green-600 font-bold">Completed</p>}
                    </div>
                ))}
            </div>
        </div>
    );
};

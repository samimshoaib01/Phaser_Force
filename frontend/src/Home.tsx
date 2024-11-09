import { Link } from "react-router-dom";

export const Home = () => {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-800 via-gray-700 to-gray-900 p-6">
            <div className="flex flex-col items-center space-y-6 p-8 bg-gray-800 bg-opacity-90 backdrop-blur-lg rounded-xl shadow-2xl border border-gray-700">
                <h1 className="text-3xl font-bold text-yellow-400 tracking-wider mb-6">Welcome to the Adventure</h1>
                
                <Link 
                    to={'/signin'} 
                    className="w-48 py-3 text-center bg-yellow-600 text-white font-semibold rounded-md shadow-lg hover:bg-yellow-500 transform hover:scale-105 transition-all duration-200"
                >
                    Signin
                </Link>

                <Link 
                    to={'/signup'} 
                    className="w-48 py-3 text-center bg-blue-700 text-white font-semibold rounded-md shadow-lg hover:bg-blue-600 transform hover:scale-105 transition-all duration-200"
                >
                    Signup
                </Link>
            </div>
        </div>
    );
}

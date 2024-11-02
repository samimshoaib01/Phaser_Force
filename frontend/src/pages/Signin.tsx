import { useState } from "react";
import axios from "axios"; // Make sure to import axios
import SignInButton from "../SignInButton";

export const Signin = () => {

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://localhost:3000/auth/local", {
        email,
        password,
      });
      console.log("Response:",res.data);
    } catch (error) {
console.log(error);
      }
  };

  return (
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
    </div>
  );
};

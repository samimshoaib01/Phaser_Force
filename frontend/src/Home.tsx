import { Link } from "react-router-dom";

export const Home=() =>{
 
  
    return (
        <>
        <Link to={'/signin'} className="inline-block border-2 border-black bg-red-200 p-10 m-10">Signin</Link>
        <Link to={'/signup'} className="inline-block border-2 border-black bg-red-200 p-10 m-10">Signup</Link>

        </>
    );
}



import { useEffect } from "react"
import { Link, useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import { validUser } from "../components/recoil";

export const Play=()=> {
    const [isValid , setIsValid]=useRecoilState(validUser)
    const navigate=useNavigate(); 
    useEffect(() => {
    
      if (!isValid)
        navigate("/signup");

        const queryParams = new URLSearchParams(window.location.search);
         const token= queryParams.get('verified');
        console.log("TOKEN!! : ",token);
         if(token){
          localStorage.setItem("token",token);
          setIsValid(true);
         }
         else{
          navigate("/signup")
         }
    
      }, []);

  return (
    <div>
       <Link to='/newgame' className="bg-red-200">New Game</Link>{/* to play new game move to Level 1 default coordinate  */}
       <Link to='/resume' className="bg-blue-200 m-10" >Resume</Link>  {/* when resumed move to the  Level and coordinate stored in database */}
       <button className="bg-slate-200 m-10" >LeaderBoard</button>  {/* show top 10 players who have completed the game and the time taken by them to comp the game */}
       {/* when player closes the game update the database with the latest coordinates and level ->(how to get the latest level store the current level in localstorage as the user proceed ) */}
    </div>
  )
}


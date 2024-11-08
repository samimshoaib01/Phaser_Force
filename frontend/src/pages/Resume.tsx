import { useEffect } from "react"
import { useNavigate } from "react-router-dom";
import axios from "axios";


export const Resume=() =>{
  
  const navigate=useNavigate();
  useEffect(()=>{

      const fun=async()=>{
        try {
          const res = await axios.get("http://localhost:3000/resume",{
            headers:{
              Authorization: localStorage.getItem("token")
            }
          });
          // to resume the game 
          console.log("user level and coordinates: ",res.data);
          const user=res.data;
          localStorage.setItem("playerProgress",JSON.stringify(user));
          navigate('/game')
        } catch (error) {
            navigate('/signin');
        }
           
      }
      fun();

  },[])
  return (
    <div>Resume</div>
  )
}

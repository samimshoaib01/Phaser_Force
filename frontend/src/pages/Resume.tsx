import { useEffect } from "react"
import { useNavigate } from "react-router-dom";
import axios from "axios";

interface ResumeData{
Level:string,
x:number,
y: number,
onGoingTime: number,
penalities: number
}

export const Resume=() =>{
  
  const navigate=useNavigate();
  useEffect(()=>{

      const fun=async()=>{
        try {
          const res = await axios.get<ResumeData>("http://localhost:3000/resume",{
            headers:{
              Authorization: localStorage.getItem("token")
            }
          });
          // to resume the game 
          console.log("user level and coordinates: ",res.data);
          const user=res.data;
          if(!user.Level){
            navigate('/leaderboard');
          }
          else{
            console.log("RESUMED DATA : ",user);
            localStorage.setItem("playerProgress",JSON.stringify(user));
            navigate('/game')
          }
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

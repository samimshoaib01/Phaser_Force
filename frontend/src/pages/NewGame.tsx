import { useEffect } from "react"
import { useNavigate } from "react-router-dom";
import axios from "axios";

interface newgame{
  Level:string,
  isCompleted:boolean,
  x:number,
  y: number
}

export const NewGame=()=> {
    const navigate=useNavigate();

    useEffect(()=>{
    
        const fun=async()=>{
          try {
            const res = await axios.put<newgame>("http://localhost:3000/newgame",{},{
              headers:{
                Authorization: localStorage.getItem("token")
              }
            });
  
           
            const user=res.data;
            console.log("value to be set in local storage" ,user);
            localStorage.setItem("playerProgress",JSON.stringify(user));
            navigate('/game')
          } catch (error) {
              navigate('/signin');
          }
             
        }
        fun();

    },[])
  return (
    <div>NewGame</div>
  )
}

import { useEffect } from "react"
import { useRecoilValue } from "recoil"
import { validUser } from "../components/recoil"
import { useNavigate } from "react-router-dom";
import axios from "axios";

export const NewGame=()=> {
    const isvalid=useRecoilValue(validUser);
    const navigate=useNavigate();

    useEffect(()=>{
      if(!isvalid){
        navigate("/signup");
      }
        const fun=async()=>{
          try {
            const res = await axios.put("http://localhost:3000/newgame",{},{
              headers:{
                Authorization: localStorage.getItem("token")
              }
            });
  
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
    <div>NewGame</div>
  )
}

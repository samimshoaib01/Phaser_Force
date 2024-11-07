import { atom } from "recoil";
import axios from "axios";

const checkValidUser=async()=>{
    const token=localStorage.getItem("token");
    if(!token){
        return false;
    }
    try {
        const res=await axios.get('http://localhost:3000/auth',{
            headers:{
                Authorization: token
            }
        });
        return true;
    } catch (error) {
        return false;
    }
}
export const validUser= atom({
    key:"validUser",
    default:false,
    effects_UNSTABLE:[
        ({ setSelf })=>{
            checkValidUser().then((isValid:boolean)=>{
                setSelf(isValid)
            })
        }
    ]
})
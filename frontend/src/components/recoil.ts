import { atom } from "recoil";
import axios from "axios";

interface userInfo{
    userId:number,
    name:string,
    isValid:boolean,
}
const checkValidUser = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
        return { isValid: false, userId: 0, name: "Invalid User" };
    }
    try {
        const res = await axios.get<userInfo>('http://localhost:3000/auth', {
            headers: {
                Authorization: token
            }
        });
        const { userId, name , isValid} = res.data; // Assuming `userId` and `name` are returned in the response
        return { isValid, userId, name };
    } catch (error) {
        return { isValid: false, userId: 0, name: "Invalid User" };
    }
}

export const validUser = atom({
    key: "validUser",
    default: { isValid: false, userId: 0 , name: "Invalid User" },
    effects_UNSTABLE: [
        ({ setSelf }) => {
            checkValidUser().then(({isValid, userId, name })=> {
                setSelf({isValid, userId, name });
            });
        }
    ]
});

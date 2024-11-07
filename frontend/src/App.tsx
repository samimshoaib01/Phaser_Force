import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Signin } from "./pages/Signin";
import { Home } from "./Home";
import PhaserGame from "./PhaserGame";
import { Signup } from "./pages/Signup";
import { useRecoilValue } from "recoil";
import { validUser } from "./components/recoil";
import { Play } from "./pages/Play";
import { NewGame } from "./pages/NewGame";
import { Resume } from "./pages/Resume";


function App() {
    const isvalid=useRecoilValue(validUser);
    console.log('check valid: ',isvalid);
    return (
        
        <BrowserRouter>
            <Routes>
                
                <Route path="/" element={<Home/>}/>
                <Route path="/signin" element={<Signin/>}/>
                <Route path="/signup" element={<Signup/>}/>
                <Route path="/play"  element={ <Play/> }/>
                <Route path="/game" element={ isvalid? <PhaserGame /> :<Signup/>}/>
                <Route path="/newgame" element={<NewGame/>}/>
                <Route path="/resume" element={<Resume/>}/>

                
            
            </Routes>
        </BrowserRouter>
    );
}

export default App;

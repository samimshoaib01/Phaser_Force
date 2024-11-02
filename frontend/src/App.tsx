import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Signin } from "./pages/Signin";
import { Home } from "./Home";
import PhaserGame from "./PhaserGame";


function App() {
  
    return (
        
        <BrowserRouter>
            <Routes>
                
                <Route path="/" element={<Home/>}/>
                <Route path="/signin" element={<Signin/>}/>
                <Route path="/game" element={<PhaserGame/>}/>
            
            </Routes>
        </BrowserRouter>
    );
}

export default App;

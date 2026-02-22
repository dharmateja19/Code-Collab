import Login from "./components/Login.jsx";
import Register from "./components/Register.jsx";
import {BrowserRouter, Routes, Route} from "react-router-dom";
import Home from "./components/Home.jsx";
import Navbar from "./components/Navbar.jsx";
import Room from "./components/JoinRoom.jsx";

function App() {
  return (
    <>
      <BrowserRouter>
        <Navbar/>
        <Routes>
          <Route path="/" element={ <Home/> }></Route>
          <Route path="/login" element = {<Login/>}></Route>
          <Route path="/register" element= {<Register/>}></Route>
          <Route path="/joinroom" element = {<Room/>}></Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;

import Login from "./components/Login.jsx";
import Register from "./components/Register.jsx";
import {BrowserRouter, Routes, Route} from "react-router-dom";
import Home from "./components/Home.jsx";
import Navbar from "./components/Navbar.jsx";
// import Profile from "./components/Profile.jsx";
import Dashboard from "./components/Dashboard.jsx";
import RoomEditor from "./components/RoomEditor.jsx";

function App() {
  return (
    <>
      <BrowserRouter>
        <Navbar/>
        <Routes>
          <Route path="/" element={ <Home/> }></Route>
          <Route path="/login" element = {<Login/>}></Route>
          <Route path="/register" element= {<Register/>}></Route>
          <Route path="/dashboard" element= {<Dashboard/>}></Route>
          {/* <Route path="/profile" element= {<Profile/>}></Route> */}
          <Route path="/room/:roomId" element={<RoomEditor />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;

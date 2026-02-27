import Login from "./components/Login.jsx";
import Register from "./components/Register.jsx";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./components/Home.jsx";
import Navbar from "./components/Navbar.jsx";
import Dashboard from "./components/Dashboard.jsx";
import RoomEditor from "./components/RoomEditor.jsx";
import { Toaster } from "react-hot-toast";
import Footer from "./components/Footer.jsx";
import NotFound from "./components/NotFound.jsx";
function App() {
  return (
    <>
      <BrowserRouter>
        <div className="flex flex-col h-screen">
          <Navbar />
          <div className="flex-1 overflow-auto">
            <Toaster
              position="top-right"
              toastOptions={{
                style: {
                  background: "#1e1e1e",
                  color: "#fff",
                  border: "1px solid #333",
                },
              }}
            />
            <Routes>
              <Route path="/" element={<Home />}></Route>
              <Route path="/login" element={<Login />}></Route>
              <Route path="/register" element={<Register />}></Route>
              <Route path="/dashboard" element={<Dashboard />}></Route>
              <Route path="/room/:roomId" element={<RoomEditor />} />
              <Route path="*" element={<NotFound />} />
          </Routes>
          </div>
          <Footer />
        </div>
      </BrowserRouter>
    </>
  );
}

export default App;

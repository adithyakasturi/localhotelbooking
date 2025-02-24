import { Routes, Route } from "react-router-dom";
import Login from "./Login";
import Signup from "./Signup";
import Userregister from "./Userregister";
import UserProfile from "./UserProfile";
import "./App.css";
function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/register" element={<Userregister />} />
        <Route path="/profile" element={<UserProfile />} />
      </Routes>
    </>
  );
}

export default App;

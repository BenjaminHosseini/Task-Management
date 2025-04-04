import React from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import ToDoList from './components/ToDoList.tsx';
import Login from './components/Login.tsx';
import Register from './components/register.tsx';
import api from "./api/axiosInstance";

function App() {
  return (
    <Router>
      <Main />
    </Router>
  );
}

function Main() {
  const navigate = useNavigate();

  // Intercept 401 errors inside React Router
  api.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response && error.response.status === 401) {
        console.log("Token expired or unauthorized access detected.");
        sessionStorage.removeItem("token");
        navigate("/login"); //full page reload
      }
      return Promise.reject(error);
    }
  );

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/todo" element={<ToDoList />} />
    </Routes>
  );
}

export default App;

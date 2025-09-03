import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useState, useEffect } from "react";
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";
import Profile from "./components/Profile";
import AdminPanel from "./components/AdminPanel";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetchUserProfile(token);
    } else {
      setLoading(false);
    }
  }, [])

  const fetchUserProfile = async (token) => {
    try {
      const response = await fetch("http://localhost:3000/api/auth/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      } else {
        localStorage.removeItem("token");
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
      localStorage.removeItem("token");
    }
    setLoading(false);
  };

  const login = (userData, token) => {
    setUser(userData);
    localStorage.setItem("token", token);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("token");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/login" element={user? <Navigate to="/dashboard" /> : <Login onLogin={login} />}/>
          <Route path="/register" element={user ? (<Navigate to="/dashboard" />) : (<Register onRegister={login} />)}/>
          <Route path="/dashboard" element={user ? (<Dashboard user={user} onLogout={logout} />) : (<Navigate to="/login" />)}/>
          <Route path="/profile" element={user ? (<Profile user={user} onLogout={logout} />) : (<Navigate to="/login" />)}/>
          <Route path="/admin" element={user && user.role === "admin" ? (<AdminPanel user={user} onLogout={logout} />) : (<Navigate to="/dashboard" />)}/>
          <Route path="/" element={<Navigate to={user ? "/dashboard" : "/login"} />}/>
        </Routes>
      </div>
    </Router>
  );
}

export default App;

import {BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom';
import Login from './pages/login';
import Register from './pages/register';
import {isAuthenticated} from './services/auth';

function App() {
  const isAuth = isAuthenticated();
  
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={isAuth ? <div>Dashboard</div> : <Navigate to="/login" />} />
          <Route path="/" element={<Navigate to={isAuth ? "/dashboard" : "/login"} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
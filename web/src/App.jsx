import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Login from './screens/Login.jsx'
import Registration from './screens/Registration.jsx'
import Home from './screens/Home.jsx'
import Upload from './screens/Upload.jsx'
import AudioListScreen from './components/AudioListScreen.jsx'
/* import Profile from './screens/profile';
 */
export default function App() {
  return (
    <Router>

      <Routes>
        <Route path="/" element={<Login/>} />
        <Route path="/Registration" element={<Registration/>} />
        <Route path="/Home" element={<Home/>} />
        <Route path="/Login" element={<Login/>} />
        <Route path="/Upload" element={<Upload/>} />
{/*         <Route path="/profile" element={<Profile/>} />
 */} 
      </Routes>
    </Router>
  );
};



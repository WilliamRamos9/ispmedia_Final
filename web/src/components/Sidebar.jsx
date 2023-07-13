import React, { useState } from 'react';
import './Sidebar.css';
import { IoHomeOutline, IoRadioOutline, IoFilmOutline, IoMusicalNotesOutline } from "react-icons/io5";
import { AiOutlineUpload } from 'react-icons/ai';
import logoSidebar from '../assets/logoSidebar.png';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

export default function Sidebar() {
  const [activeIcon, setActiveIcon] = useState(null);
  const navigate = useNavigate();

  const handleIconClick = (iconName) => {
    setActiveIcon(iconName);
    switch (iconName) {
      case 'home':
        navigate('/home');
        break;
      case 'upload':
        navigate('/Upload');
        break;
      default:
        break;
    }
  };

  const getIconClassName = (iconName) => {
    return `icon ${activeIcon === iconName ? 'active' : ''}`;
  };

  return (
    <div className="sidebar">
      <img src={logoSidebar} className="logo-sidebar" alt="Owner's Photo" />
        <IoHomeOutline
        className={getIconClassName('home')}
        onClick={() => handleIconClick('home')}
      />
      
      <IoFilmOutline
        className={getIconClassName('film')}
        onClick={() => handleIconClick('film')}
      />
        <IoRadioOutline
        className={getIconClassName('radio')}
        onClick={() => handleIconClick('radio')}
      />
        <IoMusicalNotesOutline
        className={getIconClassName('musica')}
        onClick={() => handleIconClick('musica')}/>

        <AiOutlineUpload
        className={getIconClassName('upload')}
        onClick={() => handleIconClick('upload')}
        />
    </div>

  );
}

import React from 'react';
import avatar from '../assets/artist2.jpg';
import './TopBar.css';

export default function TopBar(props) {

    return (

        <div className="top-bar">
            <input className="search" type="search" placeholder="Search..." />

            <p>Olá, {props.name}</p>
            <img src={props.image} className="profile-picture" alt="Owner's Photo" />
        </div>

    );
};





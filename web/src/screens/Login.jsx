import React from 'react';
import './Login.css';
import logo from '../../src/assets/logo.png';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import "./Login.css"
import { useState } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { FIREBASE_DB } from '../firebase.ts';




export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const validateEmail = (email) => {
    const emailRegex = /^(19|20)\d{6}@isptec.co.ao$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent form submission from refreshing the page

    if (validateEmail(email)) {
      try {
        const q = query(
          collection(FIREBASE_DB, 'pessoa'),
          where('email', '==', email),
          where('password', '==', password)
        );

        const querySnapshot = await getDocs(q);

        if (querySnapshot.size > 0) {
          const registeredPersonId = querySnapshot.docs[0].id;
          console.log('Entered with ID: ', registeredPersonId);
          navigate('/Home', { state: { personId: registeredPersonId } });
        } else {
          console.log('The user does not exist');
          alert('Conta não existe.');
        }
      } catch (error) {
        console.log('Error:', error);
      }
    } else {
      alert(
        'Formato de e-mail inválido. Por favor introduza um e-mail do formato ISPTEC (Ex: 20230001@isptec.co.ao)'
      );
    }
  };

  return (

    <div className="container">
      <div className="background-image">

        <div className="login-container">
          <div className="left-side">
            <div className="logo">
              <img src={logo} alt="Logo" />
            </div>
          </div>
          <div className="right-side">
            <div className="login-form">
              <form onSubmit={handleSubmit}>
                <p className="welcome">Bem-Vindo ao Ispmedia!</p>
                <input type="text" placeholder="Username" value={email} onChange={(e) => setEmail(e.target.value)} />
                <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                <button type="submit">Login</button>
                <p className="registration-info">
                  Não tem conta? <Link to="/Registration">Registrar</Link>
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};


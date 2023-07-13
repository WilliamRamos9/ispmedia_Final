import React, {useState} from 'react';
import './Registration.css'; 
import logo from '../../src/assets/logo.png';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import { FIREBASE_DB } from '../firebase.ts';

export default function Login () {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [ConfPass, setConfPass]=useState('');
  const navigate= useNavigate();


  const validateEmail = (email) => {
    const emailRegex = /^(19|20)\d{6}@isptec.co.ao$/;
    return emailRegex.test(email);

  };
  const ValidatePassword=(password,ConfPass)=>{
    return password===ConfPass;
  }

  
  const handleRegister = async (e) => {
    e.preventDefault(); // Prevent form submission from refreshing the page

    if (validateEmail(email)) {
      if(ValidatePassword(password,ConfPass)){
        try {
          const querySnapshot = await getDocs(
            query(
              collection(FIREBASE_DB, 'pessoa'),
              where('email', '==', email),
              where('password', '==', password)
            )
          );
  
          if (!querySnapshot.empty) {
            console.log('Usuário já existe na base de dados');
            alert('Esta conta já existe.');
            return;
          }
  
          const docRef = await addDoc(collection(FIREBASE_DB, 'pessoa'), {
            name,
            surname,
            password,
            email,
          });
          console.log('Nova pessoa criada com ID:', docRef.id);
          // navigation.navigate('Login'); // Navigation logic for React Router or similar library
          navigate('/Login');
        } catch (error) {
          console.log('Erro ao criar uma nova pessoa:', error);
        }
      }
      else{
        alert("As Passwords não são compatíveis");
      }
    } else {
      alert('Formato de e-mail inválido. Por favor introduza um e-mail do formato ISPTEC.');
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
            <form onSubmit={handleRegister}>
                <p className="welcome">Bem-Vindo ao ISPMEDIA!</p>
                <input type="text" placeholder="Nome" value={name} onChange={(e)=>setName(e.target.value)}/>
                <input type="text" placeholder="Sobrenome" value={surname} onChange={(e)=>setSurname(e.target.value)}/>
                <input type="text" placeholder='Email' value={email} onChange={(e)=>setEmail(e.target.value)}/>
                <input type="password" placeholder="Password" value={password} onChange={(e)=>setPassword(e.target.value)}/>
                <input type="password" placeholder="Confirmar password" value={ConfPass} onChange={(e)=>setConfPass(e.target.value)}/>
                <button type="submit">Register</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


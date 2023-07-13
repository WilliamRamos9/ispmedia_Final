import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, ScrollView, ImageBackground, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import { ref, getDownloadURL } from 'firebase/storage';
import { FIREBASE_STORAGE, FIREBASE_DB } from '../../FirebaseConfig';
import { useNavigation } from '@react-navigation/native';
import logo from '../assets/logo.jpg'

export default function Register() {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');


  const validateEmail = (email) => {
    const emailRegex = /^(19|20)\d{6}@isptec.co.ao$/;
    return emailRegex.test(email);

  };

  const navigation = useNavigation();

  function handleLogin() {
    navigation.navigate("Login");
  }

  const handleRegister = async () => {

    if (validateEmail(email)) {

      try {
        // Verifica se já existe um usuário com o mesmo nome de usuário e senha na base de dados
        const querySnapshot = await getDocs(
          query(
            collection(FIREBASE_DB, 'pessoa'),
            where('email', '==', email),
            where('password', '==', password)
          )
        );

        if (!querySnapshot.empty) {
          console.log('Usuário já existe na base de dados');
          alert('Esta conta já existe.')
          return;
        }

        const defaultImageRef = ref(FIREBASE_STORAGE, '/images/avatar.png');
        const defaultImageUrl = await getDownloadURL(defaultImageRef);

        // Cria um novo documento na coleção 'pessoa' com os dados fornecidos
        const docRef = await addDoc(collection(FIREBASE_DB, 'pessoa'), {
          name,
          surname,
          password,
          email,
          imageUrl: defaultImageUrl,
          uploaded: 'no',
        });
        console.log('Nova pessoa criada com ID:', docRef.id);
        navigation.navigate('Login');
      } catch (error) {
        console.log('Erro ao criar uma nova pessoa:', error);
      }
    } else {
      alert('Formato de e-mail inválido. Por favor introduza um e-mail do formato ISPTEC.');

    }
  };


  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.scrollView}>


        <View style={styles.container}>



          <Image source={logo} style={styles.logo} />


          <View style={styles.inputView}>
            <TextInput
              style={styles.inputText}
              placeholder="Nome"
              placeholderTextColor="#fff"
              value={name}
              onChangeText={(text) => setName(text)}
            />
          </View>

          <View style={styles.inputView}>
            <TextInput
              style={styles.inputText}
              placeholder="Sobrenome"
              placeholderTextColor="#fff"
              value={surname}
              onChangeText={(text) => setSurname(text)}
            />
          </View>

          <View style={styles.inputView}>
            <TextInput
              style={styles.inputText}
              placeholder="Email"
              placeholderTextColor="#fff"
              value={email}
              onChangeText={(text) => setEmail(text)}
            />
          </View>
          <View style={styles.inputView}>
            <TextInput
              style={styles.inputText}
              placeholder="Password"
              placeholderTextColor="#fff"
              secureTextEntry
              value={password}
              onChangeText={(text) => setPassword(text)}
            />
          </View>
          <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
            <Text style={styles.registerButtonText}>REGISTAR</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleLogin}>
            <Text style={styles.registerText}>Já tem conta? Faça login</Text>
          </TouchableOpacity>



        </View>
      </ScrollView>

    </KeyboardAvoidingView>
  )



}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 250,
    height: 155,
    marginTop: 20,
    marginBottom: 50,
  },
  
  scrollView: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  inputView: {
    width: 300,
    backgroundColor: 'pink',
    borderRadius: 25,
    height: 50,
    marginBottom: 20,
    justifyContent: 'center',
    padding: 20,
  },
  inputText: {
    height: 50,
    color: 'white',
  },
  registerButton: {
    width: 100,
    backgroundColor: 'pink',
    borderRadius: 25,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    alignSelf: 'center',
  },
  registerButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  registerText: {
    color: 'pink',
    fontSize: 16,
    opacity: 0.7,
    alignSelf: 'center',
    marginTop: 10,

  },
});


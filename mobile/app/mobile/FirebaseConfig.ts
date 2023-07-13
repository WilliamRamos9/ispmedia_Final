// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth} from 'firebase/auth'
import {getFirestore} from 'firebase/firestore'
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
/* const firebaseConfig = {
  apiKey: "AIzaSyD87eVGe7vyOAA18GvKJUY4HocMPled3YY",
  authDomain: "ispmedia-e6cc7.firebaseapp.com",
  projectId: "ispmedia-e6cc7",
  storageBucket: "ispmedia-e6cc7.appspot.com",
  messagingSenderId: "104970647091",
  appId: "1:104970647091:web:f2ada78ce36effb1009546",
  measurementId: "G-PLR6R1MDNQ"
};*/

const firebaseConfig = {
  apiKey: "AIzaSyBNzFGJ9NXcaRW7vByAKkDXM_KbXWEBtec",
  authDomain: "ispmedia-7f000.firebaseapp.com",
  projectId: "ispmedia-7f000",
  storageBucket: "ispmedia-7f000.appspot.com",
  messagingSenderId: "250632601182",
  appId: "1:250632601182:web:1cd7c9bb1780d4f4447ecf"
}; 

// Initialize Firebase
export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIREBASE_AUTH = getAuth(FIREBASE_APP);
export const FIREBASE_DB = getFirestore(FIREBASE_APP);
export const FIREBASE_STORAGE = getStorage(FIREBASE_APP);
import firebase from "firebase/app";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD4A7g9s_u2ASG0lRG4jg3kv6mUP7YljtQ",
  authDomain: "prueba-e8e25.firebaseapp.com",
  projectId: "prueba-e8e25",
  storageBucket: "prueba-e8e25.appspot.com",
  messagingSenderId: "1011513281290",
  appId: "1:1011513281290:web:1fe1e7b896ea65f43548f3",
};

export const firebaseapp = firebase.initializeApp(firebaseConfig);

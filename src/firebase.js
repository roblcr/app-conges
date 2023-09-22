// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, deleteUser, signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore, collection, addDoc } from "firebase/firestore"; // Importez les fonctions nécessaires
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDHv8onGrm5ECwhJ3QV8hh5aN1Fj5lOIdg",
  authDomain: "app-conges.firebaseapp.com",
  projectId: "app-conges",
  storageBucket: "app-conges.appspot.com",
  messagingSenderId: "168916624044",
  appId: "1:168916624044:web:5f197e2c355913a6e23509"
};


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app)

export { app, auth, db, createUserWithEmailAndPassword, collection, addDoc, deleteUser, signInWithEmailAndPassword };
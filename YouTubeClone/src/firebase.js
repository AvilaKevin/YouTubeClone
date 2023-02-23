// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// GoogleAuthProvider nos permite acceder a traves del boton de google
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBs_pDUBFRKhVwLvQcpYiEw7_KHfGdNj6A",
    authDomain: "video-7e86b.firebaseapp.com",
    projectId: "video-7e86b",
    storageBucket: "video-7e86b.appspot.com",
    messagingSenderId: "1025848928851",
    appId: "1:1025848928851:web:406e7ec32d52916f92b4a6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const provider = new GoogleAuthProvider();

export default app;
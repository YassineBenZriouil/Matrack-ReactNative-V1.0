// Import the functions you need from the SDKs you need

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDSfNJJJThiZr9yazmrMp6IVb6QCl_Yf6A",
    authDomain: "mattrak-952b3.firebaseapp.com",
    projectId: "mattrak-952b3",
    storageBucket: "mattrak-952b3.firebasestorage.app",
    messagingSenderId: "256613736962",
    appId: "1:256613736962:web:911047d88f3a0ce4cc7d1b",
    measurementId: "G-WV7C123553",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };

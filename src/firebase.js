// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyBE_zN2PnfcfP8vYvrGB6JiOYmz7UdFP_w",
    authDomain: "trading-app-ef8fd.firebaseapp.com",
    projectId: "trading-app-ef8fd",
    storageBucket: "trading-app-ef8fd.firebasestorage.app",
    messagingSenderId: "455963563170",
    appId: "1:455963563170:web:cc8c098ce49bfb9ed073fb",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

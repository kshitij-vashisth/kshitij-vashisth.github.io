// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyDRboiV6Z3f7BZ57xaRcCbVU0kCj6rAg0I",
    authDomain: "visitor-counter-2618a.firebaseapp.com",
    projectId: "visitor-counter-2618a",
    storageBucket: "visitor-counter-2618a.firebasestorage.app",
    messagingSenderId: "487740842825",
    appId: "1:487740842825:web:9acf69d54f2362f59f3098"
  };

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

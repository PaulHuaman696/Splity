import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDqPHOOgumHk25nUE4fp9QmxC-nQudBDKA",
  authDomain: "splity-1a02e.firebaseapp.com",
  projectId: "splity-1a02e",
  storageBucket: "splity-1a02e.firebasestorage.app",
  messagingSenderId: "432131681494",
  appId: "1:432131681494:web:8f087926a256a5ac49ad77",
  measurementId: "G-RXCWW3NHVV"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app); // 👈 Usamos Firebase Auth, no analytics

export { auth };

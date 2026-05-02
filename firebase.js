import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC6hIiMAoFgS-2R5Y4-k0wsSGZe5pvqLco",
  authDomain: "spendsnitch.firebaseapp.com",
  projectId: "spendsnitch",
  storageBucket: "spendsnitch.firebasestorage.app",
  messagingSenderId: "712018147829",
  appId: "1:712018147829:web:bed9f7bb96226c4f63c8bc",
  measurementId: "G-RV6H5JC2N4",
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAeZRBMtaecRC9loRUas17KK4LJvQbQtRQ",
  authDomain: "file-transfer-38ca1.firebaseapp.com",
  projectId: "file-transfer-38ca1",
  storageBucket: "file-transfer-38ca1.appspot.com",
  messagingSenderId: "320015610320",
  appId: "1:320015610320:web:5b4e50b2b0dc13dca2c9d5",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore();

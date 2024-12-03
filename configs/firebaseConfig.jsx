// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: "explorer-1844f.firebaseapp.com",
  projectId: "explorer-1844f",
  storageBucket: "explorer-1844f.firebasestorage.app",
  messagingSenderId: "506673242139",
  appId: "1:506673242139:web:f89eb7e6322699c06858be",
  measurementId: "G-BMZGLYX40W",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);

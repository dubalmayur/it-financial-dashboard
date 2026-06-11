import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDGieOnSDN1C_v69liJOBTh0XhacOJwP7c",
  authDomain: "it-financial-dashboard.firebaseapp.com",
  projectId: "it-financial-dashboard",
  storageBucket: "it-financial-dashboard.firebasestorage.app",
  messagingSenderId: "849970238443",
  appId: "1:849970238443:web:9514585d283f46f1493fae",
  measurementId: "G-SX2Z46XH4D"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export default app;

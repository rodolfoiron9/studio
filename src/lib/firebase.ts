// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

// Your web app's Firebase configuration
const firebaseConfig = {
  projectId: "rudybtz-albumverse",
  appId: "1:164281201515:web:015b996941a348ba0b922e",
  storageBucket: "rudybtz-albumverse.firebasestorage.app",
  apiKey: "AIzaSyC1j1HBkuhL3vXvXg6LWf9pnNlHGv0xwnc",
  authDomain: "rudybtz-albumverse.firebaseapp.com",
  messagingSenderId: "164281201515",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export { app };

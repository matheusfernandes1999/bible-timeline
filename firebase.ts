import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBQaYG5t66leS1HoEMqIP1IDP3M4ZiCvCM",
  authDomain: "bible-timeline-58605.firebaseapp.com",
  projectId: "bible-timeline-58605",
  storageBucket: "bible-timeline-58605.firebasestorage.app",
  messagingSenderId: "40551266101",
  appId: "1:40551266101:web:64bf8b9cf5ecad1ae1be7c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
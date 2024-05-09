import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCJMGjHaYIU4F3Ou_JeY7HpsRZaibU7dxI",
  authDomain: "todoapp-39f47.firebaseapp.com",
  projectId: "todoapp-39f47",
  storageBucket: "todoapp-39f47.appspot.com",
  messagingSenderId: "850147136904",
  appId: "1:850147136904:web:006f147c0e997245b2963d",
  measurementId: "G-NRMSMCNKZN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

console.log("Firebase initialized with Firestore:", db);


export{ db };
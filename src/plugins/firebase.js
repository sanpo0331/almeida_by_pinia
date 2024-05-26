import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBLNsy--enbcIjaEJPSbQuqqckroAIaF-8",
  authDomain: "almeida-291d6.firebaseapp.com",
  projectId: "almeida-291d6",
  storageBucket: "almeida-291d6.appspot.com",
  messagingSenderId: "24804077225",
  appId: "1:24804077225:web:217f92fe108afbd7a483b8",
};

const app = initializeApp(firebaseConfig);

export const firebaseDb = getFirestore(app);

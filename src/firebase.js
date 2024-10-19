
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCNesGyobWy31fIR2ysA6MRf5SodV0GJaY",
  authDomain: "crud-test-7d561.firebaseapp.com",
  projectId: "crud-test-7d561",
  storageBucket: "crud-test-7d561.appspot.com",
  messagingSenderId: "286603631828",
  appId: "1:286603631828:web:0f2fa50eb5a5c387636f41"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const storage = getStorage(app);
import { getApp, getApps, initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDxFH0X9tZlVqvNRP5FztfIn-S0CVlSddU",
  authDomain: "llm-chat-for-kids.firebaseapp.com",
  projectId: "llm-chat-for-kids",
  storageBucket: "llm-chat-for-kids.appspot.com",
  messagingSenderId: "136954488325",
  appId: "1:136954488325:web:41c28ecb323f44c2131e6c"
};

// Initialize Firebase
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
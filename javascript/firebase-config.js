import { initializeApp } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBE78nMP9WzB6kJ_bQ5KTwe5rsATmMCw_4",
  authDomain: "snackato-cde4b.firebaseapp.com",
  projectId: "snackato-cde4b",
  storageBucket: "snackato-cde4b.firebasestorage.app",
  messagingSenderId: "860864907466",
  appId: "1:860864907466:web:726cecd04cb504d03c0c33",
  measurementId: "G-1P9QRKJ0SX"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
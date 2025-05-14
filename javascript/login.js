// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-analytics.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-auth.js";
import { getFirestore, setDoc, doc } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-firestore.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBE78nMP9WzB6kJ_bQ5KTwe5rsATmMCw_4",
  authDomain: "snackato-cde4b.firebaseapp.com",
  projectId: "snackato-cde4b",
  storageBucket: "snackato-cde4b.firebasestorage.app",
  messagingSenderId: "860864907466",
  appId: "1:860864907466:web:726cecd04cb504d03c0c33",
  measurementId: "G-1P9QRKJ0SX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);

// Login functionality
const loginbtn = document.getElementById('loginbtn');

loginbtn.addEventListener("click", function(event) {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
        // Signed in successfully
        const user = userCredential.user;
        alert("Logged in successfully!");
        window.location.href = "homepage.html";
    })
    .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        alert("Error: " + errorMessage);
    });
});

// Show Password functionality
const showhidePass = document.getElementById("showhidePass");
const password = document.getElementById("password");

function togglePassword() {
    if (password.type === "password") {
        password.type = "text";
        showhidePass.classList.replace('bx-lock', 'bx-lock-open');
    } else {
        password.type = "password";
        showhidePass.classList.replace('bx-lock-open', 'bx-lock');
    }
}

showhidePass.addEventListener("click", togglePassword);
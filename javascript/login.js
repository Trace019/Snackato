// never knew shift + alt + f would make this look cleaner lmao

import { initializeApp } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-analytics.js";
import {
  getAuth,
  signInWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/11.5.0/firebase-auth.js";
import {
  getFirestore,
  setDoc,
  doc,
} from "https://www.gstatic.com/firebasejs/11.5.0/firebase-firestore.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBE78nMP9WzB6kJ_bQ5KTwe5rsATmMCw_4",
  authDomain: "snackato-cde4b.firebaseapp.com",
  projectId: "snackato-cde4b",
  storageBucket: "snackato-cde4b.firebasestorage.app",
  messagingSenderId: "860864907466",
  appId: "1:860864907466:web:726cecd04cb504d03c0c33",
  measurementId: "G-1P9QRKJ0SX",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);

// Login functionality
const loginbtn = document.getElementById("loginbtn");

loginbtn.addEventListener("click", function (event) {
  event.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  // Show loading state
  loginbtn.disabled = true;
  loginbtn.innerHTML = '<span class="spinner"></span>  Logging in...';

  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in successfully
      const user = userCredential.user;
      window.location.href = "homepage.html";
    })
    .catch((error) => {
      loginbtn.disabled = false;
      loginbtn.textContent = "Login";

      let errorMessage = "Login failed. Please try again.";
      if (error.code === "auth/invalid-credential") {
        errorMessage = "Invalid Email/Password.";
      } else if (error.code === "auth/invalid-email") {
        errorMessage = "Please enter a valid email address (e.g @gmail.com).";
      } else if (error.code === "auth/user-not-found") {
        errorMessage = "No account has been found with this email.";
      } else if (error.code === "auth/wrong-password") {
        errorMessage = "Incorrect Password.";
      }

      showErrorToast(errorMessage);
    });
});

// Show Password functionality
const showhidePass = document.getElementById("showhidePass");
const password = document.getElementById("password");

function togglePassword() {
  if (password.type === "password") {
    password.type = "text";
    showhidePass.classList.replace("fa-lock", "fa-lock-open");
  } else {
    password.type = "password";
    showhidePass.classList.replace("fa-lock-open", "fa-lock");
  }
}

showhidePass.addEventListener("click", togglePassword);

// Error Messages:

function showErrorToast(message) {
  const toast = document.createElement('div');
  toast.className = 'error-toast';
  toast.textContent = message;
  document.body.appendChild(toast);
  
  setTimeout(() => {
    toast.classList.add('show');
  }, 10);

  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => {
      document.body.removeChild(toast);
    }, 300);
  }, 3000);
}



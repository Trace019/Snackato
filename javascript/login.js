// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-analytics.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-auth.js";
import { getFirestore, setDoc, doc } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-firestore.js";

// TODO: Add SDKs for Firebase  products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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
const auth = getAuth(app); // Correct way to get authentication
const db = getFirestore(app); 

// Select the button
const loginbtn = document.getElementById('loginbtn');

loginbtn.addEventListener("click", function (event) {
    event.preventDefault(); // Prevents form submission

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    

    // Use Firebase v9+ method
    signInWithEmailAndPassword (auth, email, password)
    .then(async (userCredential) => {
        const user = userCredential.user;

        // Store username in Firestore
        await setDoc(doc(db, "users", user.uid), {
            email: email,
            password: password
        });

        alert("Logged In, successfully!");
        window.location.href = "homepage.html"; // Redirect to login page
    })
    .catch((error) => {
        alert("Error: " + error.message);
    });
});
;
// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-analytics.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-auth.js";
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
const signupbtn = document.getElementById('signupbtn');

signupbtn.addEventListener("click", function (event) {
    event.preventDefault(); // Prevents form submission

    const username = document.getElementById('username').value;
    const phone = document.getElementById('phone').value;
    const address = document.getElementById('address').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const createdAt = new Date();
    

    // Use Firebase v9+ method
    createUserWithEmailAndPassword(auth, email, password)
    .then(async (userCredential) => {
        const user = userCredential.user;

        // Store username in Firestore
        await setDoc(doc(db, "users", user.uid), {
            username: username,
            phone: phone,
            address: address,
            email: email,
            password: password,
            createdAt: new Date()
        });

        alert("Account created successfully!");
        window.location.href = "index.html"; // Redirect to login page
    })
    .catch((error) => {
        alert("Error: " + error.message);
    });
});
;
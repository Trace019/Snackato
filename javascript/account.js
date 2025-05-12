// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-analytics.js";
import { 
    getAuth, 
    createUserWithEmailAndPassword,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/11.5.0/firebase-auth.js";
import { getFirestore, setDoc, doc, getDoc } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-firestore.js";

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

// Authentication state observer
onAuthStateChanged(auth, async (user) => {
    if (user) {
        // User is signed in
        try {
            // Get user document from Firestore
            const userDoc = await getDoc(doc(db, "users", user.uid));
            if (userDoc.exists()) {
                const userData = userDoc.data();
                // Update UI elements if they exist on the page
                const userDisplay = document.getElementById("userDisplay");
                const emailDisplay = document.getElementById("emailDisplay");
                
                if (userDisplay) {
                    userDisplay.textContent = userData.username || user.email.split('@')[0];
                }
                if (emailDisplay) {
                    emailDisplay.textContent = user.email;
                }
            }
        } catch (error) {
            console.error("Error getting user document:", error);
        }
    } else {
        // User is signed out
        if (window.location.pathname.includes("options.html")) {
            window.location.href = "index.html";
        }
    }
});

// Signup functionality
const signupbtn = document.getElementById('signupbtn');
if (signupbtn) {
    signupbtn.addEventListener("click", function (event) {
        event.preventDefault();

        const username = document.getElementById('username').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        createUserWithEmailAndPassword(auth, email, password)
        .then(async (userCredential) => {
            const user = userCredential.user;

            // Store username in Firestore
            await setDoc(doc(db, "users", user.uid), {
                username: username,
                email: email,
                password: password // Note: Storing passwords in Firestore is not recommended
            });

            alert("Account created successfully!");
            window.location.href = "index.html";
        })
        .catch((error) => {
            alert("Error: " + error.message);
        });
    });
}
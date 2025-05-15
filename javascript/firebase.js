// firebase-config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-auth.js";
import { getFirestore, setDoc, doc } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-firestore.js";

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

    })
});
;
import { auth, db } from "./firebase.js";
import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-auth.js";
import {
  setDoc,
  doc,
} from "https://www.gstatic.com/firebasejs/11.5.0/firebase-firestore.js";

function showErrorToast(message) {
  const existingToasts = document.querySelectorAll(".error-toast");
  existingToasts.forEach((toast) => toast.remove());

  const toast = document.createElement("div");
  toast.className = "error-toast";
  toast.innerHTML = `
    <span class="toast-icon">!</span>
    <span class="toast-message">${message}</span>
  `;
  document.body.appendChild(toast);

  // Trigger the show the animation
  setTimeout(() => {
    toast.classList.add("show");
  }, 10);

  // Auto-dismiss after 3s
  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => {
      if (toast.parentNode) {
        document.body.removeChild(toast);
      }
    }, 300);
  }, 3000);
  console.log("Showing Error Message: ", message);
}

// Show Password
function setupPasswordToggle(passwordId, iconId) {
  const password = document.getElementById(passwordId);
  const icon = document.getElementById(iconId);

  icon.addEventListener("click", () => {
    if (password.type === "password") {
      password.type = "text";
      icon.classList.replace("fa-lock", "fa-lock-open");
    } else {
      password.type = "password";
      icon.classList.replace("fa-lock-open", "fa-lock");
    }
  });
}

// To Set Up The Toggles for both PassFields
setupPasswordToggle("password", "showPass1");
setupPasswordToggle("confirmPassword", "showPass2");

// Password Strength Checker
function checkPasswordStrength(password) {
  let strength = 0;

  // Length checker
  if (password.length >= 6) strength++;
  if (password.length >= 10) strength++;

  // Special character check
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength++;
  // No. check
  if (/\d/.test(password)) strength++;
  // Uppercase check
  if (/[A-Z]/.test(password)) strength++;
  return strength;
}

// Update Password Strength Meter
function updateStrengthMeter(password) {
  const strength = checkPasswordStrength(password);
  const meter = document.querySelector(".strength-bar");
  const hints = document.querySelectorAll(".password-hints .hint");

  // Update Meter Color & Width
  let color = "#ff0000";
  if (strength >= 3) color = "#ffcc00";
  if (strength >= 5) color = "#28a745";

  meter.style.width = `${(strength / 5) * 100}%`;
  meter.style.background = color;

  // Update Hints
  hints[0].classList.toggle("valid", password.length >= 6);
  hints[1].classList.toggle("valid", /[!@#$%^&*(),.?":{}|<>]/.test(password));
  hints[2].classList.toggle("valid", /\d/.test(password));
}

// Real-time Password Matching Check
function checkPasswordMatch() {
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirmPassword").value;
  const feedback = document.querySelector(".password-match-feedback");

  if (confirmPassword.length === 0) {
    feedback.classList.remove("visible", "valid");
    return;
  }

  feedback.classList.add("visible");

  if (password === confirmPassword) {
    feedback.classList.add("valid");
    feedback.querySelector(".match-icon").textContent = "✓";
    feedback.querySelector(".match-text").textContent = "Passwords match";
  } else {
    feedback.classList.remove("valid");
    feedback.querySelector(".match-icon").textContent = "✗";
    feedback.querySelector(".match-text").textContent = "Passwords don't match";
  }
}

// Event listeners for Password-Checkers
document.getElementById("password").addEventListener("input", (e) => {
  updateStrengthMeter(e.target.value);
  checkPasswordMatch();
});

document
  .getElementById("confirmPassword")
  .addEventListener("input", checkPasswordMatch);

// Debounce function to prevent excessive validation
function debounce(func, timeout = 300) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(this, args);
    }, timeout);
  };
}

// Signup Functionality
const signupbtn = document.getElementById("signupbtn");

signupbtn.addEventListener(
  "click",
  debounce(async (event) => {
    event.preventDefault();

    // For Firebase
    const username = document.getElementById("username").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const address = document.getElementById("address").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    // Clear previous errors
    document.querySelectorAll(".input-box").forEach((box) => {
      box.classList.remove("error");
    });

    // Validation
    let isValid = true;

    if (!username) {
      document
        .querySelector("#username")
        .closest(".input-box")
        .classList.add("error");
      isValid = false;
    }

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      document
        .querySelector("#email")
        .closest(".input-box")
        .classList.add("error");
      isValid = false;
    }

    if (password.length < 6) {
      document
        .querySelector("#password")
        .closest(".input-box")
        .classList.add("error");
      isValid = false;
    }

    if (password !== confirmPassword) {
      document
        .querySelector("#confirmPassword")
        .closest(".input-box")
        .classList.add("error");
      isValid = false;
    }

    if (!isValid) {
      showErrorToast("Please, don't let it be blank.");
      return;
    }

    // Show loading state
    signupbtn.disabled = true;
    signupbtn.innerHTML = '<span class="spinner"></span> Creating account...';

    try {
      console.log("Attempting to create user...")
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        username: username,
        phone: phone,
        address: address,
        email: email,
        password: password,
        createdAt: new Date(),
      });
      console.log("Saved in Firestore uccessful...")

      alert("Signup successful! Redirecting to Login Screen...");
      window.location.href = "index.html";
    } catch (error) {
      signupbtn.disabled = false;
      signupbtn.textContent = "Sign Up";

      let errorMessage = "Signup failed. Please try again.";
      if (error.code === "auth/email-already-in-use") {
        errorMessage = "This email is already registered.";
      } else if (error.code === "auth/invalid-email") {
        errorMessage = "Please enter a valid email address.";
      } else if (error.code === "auth/weak-password") {
        errorMessage = "Password should be at least 6 characters.";
      } else if (error.code === "auth/network-request-failed") {
        errorMessage = "Network error. Please check your connection.";
      }

      showErrorToast(errorMessage);
      console.error("Signup error:", error);
    }
  })
);

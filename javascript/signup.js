// For Signup Functionality
// Import the necessary Firebase modules
const signupbtn = document.getElementById('signupbtn');
if (signupbtn) {
    signupbtn.addEventListener("click", async (event) => {
        event.preventDefault();
        
        // Reset any previous error styles
        document.getElementById('password').style.border = "";
        document.getElementById('confirmPassword').style.border = "";
        
        const username = document.getElementById('username').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const address = document.getElementById('address').value.trim();
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        
        // Validate fields
        if (!username ||phone ||address || !email || !password || !confirmPassword) {
            alert("Please Fill In All Of The Fields!");
            return;
        }
        
        // Password validation
        if (password.length < 6) {
            alert("Password Must Be Atleast 6 Characters Long!");
            document.getElementById('password').style.border = "1px solid red";
            document.getElementById('password').focus();
            return;
        }
        
        // Confirm password validation
        if (password !== confirmPassword) {
            alert("Passwords Do Not Match!");
            document.getElementById('password').style.border = "1px solid red";
            document.getElementById('confirmPassword').style.border = "1px solid red";
            document.getElementById('confirmPassword').focus();
            return;
        }
        
        // If all validations pass, proceed with signup
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            
            await setDoc(doc(db, "users", user.uid), {
                username: username,
                phone: phone,
                address: address,
                email: email,
                password: password,
                createdAt: new Date()
            });
            
            alert("Account created successfully!");
            window.location.href = "homepage.html";
        } catch (error) {
            let errorMessage = "Signup failed!";
            if (error.code === "Auth/Email already in use.") {
                errorMessage = "Email is already in use!";
            } else if (error.code === "Auth, Invalid Email.") {
                errorMessage = "Invalid Email Address!";
            }
            alert(errorMessage);
        }
    });
}

// signup password
function setupPasswordToggle(passwordId, iconId) {
    const password = document.getElementById(passwordId);
    const icon = document.getElementById(iconId);
    
    icon.addEventListener("click", () => {
        if (password.type === "password") {
            password.type = "text";
            icon.classList.replace('bx-lock', 'bx-lock-open');
        } else {
            password.type = "password";
            icon.classList.replace('bx-lock-open', 'bx-lock');
        }
    });
}

// To Set Up The Toggles for both PassFields
setupPasswordToggle('password', 'showPass1');
setupPasswordToggle('confirmPassword', 'showPass2');

// For Signup Functionality

signupbtn.addEventListener("click", async (event) => {
    event.preventDefault();
    
    const username = document.getElementById('username').value;
    const phone = document.getElementById('phone').value;
    const address = document.getElementById('address').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    if (password !== confirmPassword) {
        alert("Passwords don't match!");
        return;
    }
})

// Password Strength Checker
function checkPasswordStrength(password) {
    let strength = 0;
    
    // Length check
    if (password.length >= 6) strength++;
    if (password.length >= 10) strength++;
    
    // Special character check
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength++;
    // Number check
    if (/\d/.test(password)) strength++;
    // Uppercase check
    if (/[A-Z]/.test(password)) strength++;
    return strength;
}

// Update Password Strength Meter
function updateStrengthMeter(password) {
    const strength = checkPasswordStrength(password);
    const meter = document.querySelector('.strength-bar');
    const hints = document.querySelectorAll('.password-hints .hint');
    
    // Update Meter Color & Width
    let color = '#ff0000';
    if (strength >= 3) color = '#ffcc00';
    if (strength >= 5) color = '#28a745';
    
    meter.style.width = `${(strength / 5) * 100}%`;
    meter.style.background = color;
    
    // Update Hints
    hints[0].classList.toggle('valid', password.length >= 6);
    hints[1].classList.toggle('valid', /[!@#$%^&*(),.?":{}|<>]/.test(password));
    hints[2].classList.toggle('valid', /\d/.test(password));
}

// Real-time Password Matching Check
function checkPasswordMatch() {
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const feedback = document.querySelector('.password-match-feedback');
    
    if (confirmPassword.length === 0) {
        feedback.classList.remove('visible', 'valid');
        return;
    }
    
    feedback.classList.add('visible');
    
    if (password === confirmPassword) {
        feedback.classList.add('valid');
        feedback.querySelector('.match-icon').textContent = '✓';
        feedback.querySelector('.match-text').textContent = 'Passwords match';
    } else {
        feedback.classList.remove('valid');
        feedback.querySelector('.match-icon').textContent = '✗';
        feedback.querySelector('.match-text').textContent = "Passwords don't match";
    }
}

// Event listeners for real-time validation
document.getElementById('password').addEventListener('input', (e) => {
    updateStrengthMeter(e.target.value);
    checkPasswordMatch();
});

document.getElementById('confirmPassword').addEventListener('input', checkPasswordMatch);

// Debounce function to prevent excessive validation
function debounce(func, timeout = 300) {
    let timer;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => { func.apply(this, args); }, timeout);
    };
}

// Enhanced signup function with all validations
signupbtn.addEventListener("click", debounce(async (event) => {
    event.preventDefault();
    
    const username = document.getElementById('username').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    // Clear previous errors
    document.querySelectorAll('.input-box').forEach(box => {
        box.classList.remove('error');
    });
    
    // Validate fields
    let isValid = true;
    
    if (!username) {
        document.querySelector('.input-box:nth-child(1)').classList.add('error');
        isValid = false;
    }
    
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
        document.querySelector('.input-box:nth-child(2)').classList.add('error');
        isValid = false;
    }
    
    if (password.length < 6) {
        document.querySelector('.input-box:nth-child(3)').classList.add('error');
        isValid = false;
    }
    
    if (password !== confirmPassword) {
        document.querySelector('.input-box:nth-child(4)').classList.add('error');
        isValid = false;
    }
    
    if (!isValid) {
        return;
    }
    
    // Show loading state
    signupbtn.disabled = true;
    signupbtn.innerHTML = '<span class="spinner"></span> Creating account...';
    
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        
        await setDoc(doc(db, "users", user.uid), {
            username: username,
            email: email,
            password: password,
            createdAt: new Date()
        });
        
        window.location.href = "homepage.html";
    } catch (error) {
        signupbtn.disabled = false;
        signupbtn.textContent = 'Sign Up';
        
        let errorMessage = "Signup failed. Please try again.";
        if (error.code === "auth/email-already-in-use") {
            errorMessage = "This email is already registered.";
        } else if (error.code === "auth/invalid-email") {
            errorMessage = "Please enter a valid email address.";
        } else if (error.code === "auth/weak-password") {
            errorMessage = "Password should be at least 6 characters.";
        }
        
        showErrorToast(errorMessage);
    }
}));

// Helper function to show error messages
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
    }, 5000);
}

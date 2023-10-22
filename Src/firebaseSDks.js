// login.js

// Firebase SDKs
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, GoogleAuthProvider, FacebookAuthProvider, GithubAuthProvider, signInWithPopup, sendPasswordResetEmail, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-auth.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyDd4yO0wA5ciU6Oou399F6ljpKTWqD5Y5g",
    authDomain: "personal-portfolio-fb.firebaseapp.com",
    projectId: "personal-portfolio-fb",
    storageBucket: "personal-portfolio-fb.appspot.com",
    messagingSenderId: "317729267902",
    appId: "1:317729267902:web:0f77266a41d836f04ffeef"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);

const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();
const githubProvider = new GithubAuthProvider();

let menu = document.querySelector('#menu-bars');
let header = document.querySelector('header');

menu.onclick = () => {
    menu.classList.toggle('fa-times');
    header.classList.toggle('active');
}

window.onscroll = () => {
    menu.classList.remove('fa-times');
    header.classList.remove('active');
}

window.showMessage = function(text) {
    const messageBox = document.getElementById('messageBox');
    const messageText = document.getElementById('messageText');
    
    messageText.textContent = text;
    messageBox.classList.remove('hidden');
}

document.getElementById('closeMessage').addEventListener('click', function() {
    document.getElementById('messageBox').classList.add('hidden');
});

const loginForm = document.getElementById('login-form');
if (loginForm) {
    loginForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                showMessage('Successfully logged in!');
                location.reload();
            })
            .catch((error) => {
                showMessage(error.message);
            });
    });
}

const registrationForm = document.getElementById('registration-form');
if (registrationForm) {
    registrationForm.addEventListener('submit', function (event) {
        event.preventDefault();
        const email = document.getElementById('register-email').value;
        const password = document.getElementById('register-password').value;
        const confirmPassword = document.getElementById('confirm-password').value;

        if (password !== confirmPassword) {
            showMessage('Passwords do not match.');
            return;
        }

        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                showMessage('Successfully registered!');
                document.getElementById('registration-form').reset();
            })
            .catch((error) => {
                showMessage(error.message);
            });
    });
}
const showRegisterModalBtn = document.getElementById('show-register-modal');
const closeRegisterModalBtn = document.getElementById('close-register-modal');
const registerModal = document.getElementById('register-modal');

if (showRegisterModalBtn && closeRegisterModalBtn && registerModal) {
    showRegisterModalBtn.addEventListener('click', function () {
        registerModal.style.display = 'block';
    });
    closeRegisterModalBtn.addEventListener('click', function () {
        registerModal.style.display = 'none';
    });
    window.onclick = function (event) {
        if (event.target == registerModal) {
            registerModal.style.display = 'none';
        }
    };
}

const loginWithGoogleBtn = document.getElementById('login-with-google');
if (loginWithGoogleBtn) {
    loginWithGoogleBtn.addEventListener('click', function () {
        signInWithPopup(auth, googleProvider)
            .then((result) => {
                showMessage('Successfully logged in with Google!');
                location.reload();
            })
            .catch((error) => {
                showMessage(error.message);
            });
    });
}

const loginWithFacebookBtn = document.getElementById('login-with-facebook');
if (loginWithFacebookBtn) {
    loginWithFacebookBtn.addEventListener('click', function () {
        signInWithPopup(auth, facebookProvider)
            .then((result) => {
                showMessage('Successfully logged in with Facebook!');
                location.reload();
            })
            .catch((error) => {
                showMessage(error.message);
            });
    });
}

const loginWithGithubBtn = document.getElementById('login-with-github');
if (loginWithGithubBtn) {
    loginWithGithubBtn.addEventListener('click', function () {
        signInWithPopup(auth, githubProvider)
            .then((result) => {
                showMessage('Successfully logged in with GitHub!');
                location.reload();
            })
            .catch((error) => {
                showMessage(error.message);
            });
    });
}

const forgotPasswordLink = document.getElementById('forgot-password');
if (forgotPasswordLink) {
    forgotPasswordLink.addEventListener('click', function(event) {
        event.preventDefault();

        const emailAddress = prompt("Please enter your email address:");
        
        if (emailAddress) {
            sendPasswordResetEmail(auth, emailAddress)
                .then(function() {
                    showMessage('Password reset email sent! Check your inbox.');
                })
                .catch(function(error) {
                    showMessage('Error: ' + error.message);
                });
        }
    });
}

onAuthStateChanged(auth, user => {
    if (user) {
        const userDoc = doc(firestore, 'users', user.uid);
        setDoc(userDoc, {
            email: user.email,
        });
    }
});

auth.onAuthStateChanged(user => {
    const loginLink = document.getElementById('showLoginModal');
    if (user) {
        if (loginLink) {
            loginLink.innerHTML = '<span class="fa-solid fa-user"></span> Log Out';
            loginLink.href = '#';
            loginLink.title = 'Log Out';
            loginLink.addEventListener('click', function(event) {
                event.preventDefault();
                const confirmation = confirm('Are you sure you want to log out?');
                if (confirmation) {
                    signOut(auth).then(() => {
                        showMessage('Logged out successfully!');
                        location.reload();
                    }).catch((error) => {
                        console.error("Error logging out: ", error);
                        showMessage('Failed to log out. Please try again.');
                    });
                }
            });
        }
    } else {
        if (loginLink) {
            loginLink.innerHTML = '<span class="fa-solid fa-user"></span> Login';
            loginLink.href = '/Src/login/login.html';
            loginLink.title = 'Login';
        }
    }
});
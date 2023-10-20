import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, GoogleAuthProvider, FacebookAuthProvider, GithubAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-auth.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-database.js";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDd4yO0wA5ciU6Oou399F6ljpKTWqD5Y5g",
    authDomain: "personal-portfolio-fb.firebaseapp.com",
    projectId: "personal-portfolio-fb",
    storageBucket: "personal-portfolio-fb.appspot.com",
    messagingSenderId: "317729267902",
    appId: "1:317729267902:web:0f77266a41d836f04ffeef"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Providers for Google, Facebook, and GitHub
const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();
const githubProvider = new GithubAuthProvider();

// Login logic
document.getElementById('login-form').addEventListener('submit', function (event) {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            alert('Successfully logged in!');
            location.reload();
        })
        .catch((error) => {
            alert(error.message);
        });
});

// Registration logic
document.getElementById('registration-form').addEventListener('submit', function (event) {
    event.preventDefault();
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    const confirmPassword = document.getElementById('confirm-password').value;

    if (password !== confirmPassword) {
        alert('Passwords do not match.');
        return;
    }

    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            alert('Successfully registered!');
            document.getElementById('registration-form').reset();
        })
        .catch((error) => {
            alert(error.message);
        });
});

// Modal logic
document.getElementById('show-register-modal').addEventListener('click', function () {
    document.getElementById('register-modal').style.display = 'block';
});
document.getElementById('close-register-modal').addEventListener('click', function () {
    document.getElementById('register-modal').style.display = 'none';
});
window.onclick = function (event) {
    if (event.target == document.getElementById('register-modal')) {
        document.getElementById('register-modal').style.display = 'none';
    }
};

// Google login
document.getElementById('login-with-google').addEventListener('click', function () {
    signInWithPopup(auth, googleProvider)
        .then((result) => {
            alert('Successfully logged in with Google!');
            location.reload();
        })
        .catch((error) => {
            alert(error.message);
        });
});

// Facebook login
document.getElementById('login-with-facebook').addEventListener('click', function () {
    signInWithPopup(auth, facebookProvider)
        .then((result) => {
            alert('Successfully logged in with Facebook!');
            location.reload();
        })
        .catch((error) => {
            alert(error.message);
        });
});

// GitHub login
document.getElementById('login-with-github').addEventListener('click', function () {
    signInWithPopup(auth, githubProvider)
        .then((result) => {
            alert('Successfully logged in with GitHub!');
            location.reload();
        })
        .catch((error) => {
            alert(error.message);
        });
});
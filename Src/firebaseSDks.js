// Import Firebase SDKs
import {
    initializeApp
} from "https://www.gstatic.com/firebasejs/10.5.0/firebase-app.js";
import {
    getAuth,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    GoogleAuthProvider,
    FacebookAuthProvider,
    GithubAuthProvider,
    signInWithPopup,
    sendPasswordResetEmail,
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/10.5.0/firebase-auth.js";
import {
    getFirestore,
    doc,
    setDoc
} from "https://www.gstatic.com/firebasejs/10.5.0/firebase-firestore.js";

// Firebase configuration object
const firebaseConfig = {
    apiKey: "AIzaSyDd4yO0wA5ciU6Oou399F6ljpKTWqD5Y5g",
    authDomain: "personal-portfolio-fb.firebaseapp.com",
    projectId: "personal-portfolio-fb",
    storageBucket: "personal-portfolio-fb.appspot.com",
    messagingSenderId: "317729267902",
    appId: "1:317729267902:web:0f77266a41d836f04ffeef"
};

// Initialize Firebase app, Auth, and Firestore
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);

// Initialize OAuth providers
const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();
const githubProvider = new GithubAuthProvider();

// Get references to HTML elements
let menu = document.querySelector('#menu-bars');
let header = document.querySelector('header');

// Event listener for menu button click
menu.onclick = () => {
    menu.classList.toggle('fa-times');
    header.classList.toggle('active');
}

// Event listener for window scroll
window.onscroll = () => {
    menu.classList.remove('fa-times');
    header.classList.remove('active');
}

// Function to display message in messageBox
window.showMessage = function(text) {
    const messageBox = document.getElementById('messageBox');
    const messageText = document.getElementById('messageText');

    messageText.textContent = text;
    messageBox.classList.remove('hidden');
}

// Event listener for closing messageBox
document.getElementById('closeMessage').addEventListener('click', function() {
    document.getElementById('messageBox').classList.add('hidden');
});

// Event listener for "forgot password" link click
const forgotPasswordLink = document.getElementById('forgot-password');
if (forgotPasswordLink) {
    forgotPasswordLink.addEventListener('click', function(event) {
        event.preventDefault();

        const forgotPasswordBox = document.getElementById('forgotPasswordBox');
        forgotPasswordBox.classList.remove('hidden');
    });
}

// Event listener for closing forgotPasswordBox
const closeForgotPassword = document.getElementById('closeForgotPassword');
if (closeForgotPassword) {
    closeForgotPassword.addEventListener('click', function() {
        document.getElementById('forgotPasswordBox').classList.add('hidden');
    });
}

// Get the element with the ID 'submitButton'
const submitButton = document.getElementById('submitButton');

// Check if the element exists before adding an event listener to it
if (submitButton) {
    submitButton.addEventListener('click', function() {
        const emailInput = document.getElementById('emailInput');
        const emailAddress = emailInput ? emailInput.value : '';

        if (emailAddress) {
            sendPasswordResetEmail(auth, emailAddress)
                .then(function() {
                    showMessage('Password reset email sent! Check your inbox.');
                })
                .catch(function(error) {
                    showMessage('Error: ' + error.message);
                });
        } else {
            showMessage('Please enter a valid email address.');
        }
    });
}

// Event listener for registration form submission
const registrationForm = document.getElementById('registration-form');
if (registrationForm) {
    registrationForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const email = document.getElementById('modal-email').value;
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

// Get references to modal buttons and modals
const showRegisterModalBtn = document.getElementById('show-register-modal');
const closeRegisterModalBtn = document.getElementById('close-register-modal');
const registerModal = document.getElementById('register-modal');

// Event listeners for showing and hiding the registration modal
if (showRegisterModalBtn && closeRegisterModalBtn && registerModal) {
    showRegisterModalBtn.addEventListener('click', function() {
        registerModal.style.display = 'block';
    });
    closeRegisterModalBtn.addEventListener('click', function() {
        registerModal.style.display = 'none';
    });
    // Close the modal if user clicks outside of it
    window.onclick = function(event) {
        if (event.target == registerModal) {
            registerModal.style.display = 'none';
        }
    };
}

// Get references to OAuth login buttons
const loginWithGoogleBtn = document.getElementById('login-with-google');
const loginWithFacebookBtn = document.getElementById('login-with-facebook');
const loginWithGithubBtn = document.getElementById('login-with-github');

// Event listeners for OAuth login buttons
if (loginWithGoogleBtn) {
    loginWithGoogleBtn.addEventListener('click', function() {
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

if (loginWithFacebookBtn) {
    loginWithFacebookBtn.addEventListener('click', function() {
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

if (loginWithGithubBtn) {
    loginWithGithubBtn.addEventListener('click', function() {
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

// Flag to check if the message box is displayed
let isMessageBoxDisplayed = false;  

// Updated event listener for closing messageBox to manage the flag
document.getElementById('closeMessage').addEventListener('click', function() {
    document.getElementById('messageBox').classList.add('hidden');
    isMessageBoxDisplayed = false;  // Reset the flag when the close button is clicked
});

// Firebase Auth state change listener
onAuthStateChanged(auth, user => {
    if (user) {
        const userDoc = doc(firestore, 'users', user.uid);
        setDoc(userDoc, {
            email: user.email,
        });
    }
});

//  login link based on auth state
auth.onAuthStateChanged(user => {
    const loginLink = document.getElementById('showLoginModal');
    if (user) {
        if (loginLink) {
            loginLink.innerHTML = '<span class="fa-solid fa-user"></span> Log Out';
            loginLink.href = '#';
            loginLink.title = 'Log Out';

            // Updated event listener for loginLink click to show a logout confirmation
            loginLink.addEventListener('click', function(event) {
                event.preventDefault();

                const messageBox = document.getElementById('messageBox');
                const messageText = document.getElementById('messageText');

                // Remove any existing 'Yes' and 'No' buttons
                const existingYes = document.getElementById('confirmYes');
                const existingNo = document.getElementById('confirmNo');
                if (existingYes) messageBox.removeChild(existingYes);
                if (existingNo) messageBox.removeChild(existingNo);

                // Create new 'Yes' and 'No' buttons for logout confirmation
                const confirmYes = document.createElement('button');
                const confirmNo = document.createElement('button');

                // Assign IDs to the new 'Yes' and 'No' buttons for future reference
                confirmYes.id = 'confirmYes';
                confirmNo.id = 'confirmNo';

                messageText.textContent = 'Are you sure you want to log out?';
                confirmYes.textContent = 'Yes';
                confirmNo.textContent = 'No';

                messageBox.appendChild(confirmYes);
                messageBox.appendChild(confirmNo);
                messageBox.classList.remove('hidden');

                // Event listeners for logout confirmation buttons
                confirmYes.addEventListener('click', function() {
                    messageBox.classList.add('hidden');
                    messageBox.removeChild(confirmYes);
                    messageBox.removeChild(confirmNo);
                    signOut(auth).then(() => {
                        showMessage('Logged out successfully!');
                        location.reload();
                    }).catch((error) => {
                        console.error("Error logging out: ", error);
                        showMessage('Failed to log out. Please try again.');
                    });
                });

                confirmNo.addEventListener('click', function() {
                    messageBox.classList.add('hidden');
                    messageBox.removeChild(confirmYes);
                    messageBox.removeChild(confirmNo);
                });
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

// Get reference to the login form
const loginForm = document.getElementById('login-form');

if (loginForm) {
    loginForm.addEventListener('submit', function(event) {
        // Prevent the default form submission behavior
        event.preventDefault();

        // Get the email and password values from the form
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        // Use Firebase Auth to sign in with email and password
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed in 
                const user = userCredential.user;
                showMessage('Successfully logged in!');
                // Optionally, redirect to another page or reload the current page
                // location.reload();
            })
            .catch((error) => {
                // Handle errors here.
                const errorCode = error.code;
                const errorMessage = error.message;
                showMessage(`Error: ${errorMessage}`);
            });
    });
}
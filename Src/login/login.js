const loginForm = document.getElementById("login-form");
const loginButton = document.getElementById("login-form-submit");
const loginErrorMsg = document.getElementById("login-error-msg");

loginButton.addEventListener("click", (e) => {
    e.preventDefault();
    const username = loginForm.username.value;
    const password = loginForm.password.value;

    if (username === "user" && password === "web_dev") {
        alert("You have successfully logged in.");
        location.reload();
    } else {
        loginErrorMsg.style.opacity = 1;
    }
})

var modal = document.getElementById('register-modal');
var btn = document.querySelector('.register');
var span = document.querySelector('.close-btn');

btn.onclick = function() {
    modal.style.display = "block";
}

span.onclick = function() {
    modal.style.display = "none";
}

window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}
// Function to log the user in

// Function to log the user out

// Function to sign the user up

// Function to sign the user out

// Function to reset the user's password

// Function to send the user a verification email

// Function to send the user a password reset email

// Function to send the user a welcome email

// Function to send the user a goodbye email

// Function to send the user a password changed email








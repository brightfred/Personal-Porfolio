document.getElementById('resetForm').addEventListener('submit', function (e) {
    e.preventDefault(); // Stop the form from actually submitting

    const email = document.getElementById('resetEmail').value;
    // Simulate sending a reset link to the given email
    sendResetLink(email);
});

function sendResetLink(email) {
    // Normally, here you would send the email to your backend server, which will then send a reset link to the user. 
    // For the purposes of this mockup, we'll just display a message.
    
    document.getElementById('resetStatus').innerText = `An email has been sent to ${email} with further instructions.`;
}
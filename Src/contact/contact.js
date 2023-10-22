import { getFirestore, addDoc, collection } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-auth.js";

const auth = getAuth();

document.addEventListener("DOMContentLoaded", function () {
    // Your code here

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

    const firestore = getFirestore();

    document.getElementById('contact-form').addEventListener('submit', async function (event) {
        event.preventDefault();

        // Check if user is logged in
        const user = auth.currentUser;
        if (!user) {
            showMessage('You need to be logged in to send a message.');
            return;
        }

        const name = document.getElementById('contact-name').value;
        const email = document.getElementById('contact-email').value;
        const number = document.getElementById('contact-number').value;
        const message = document.getElementById('contact-message').value;

        // Validate email format (basic validation is handled by the email input type, but you can add more advanced validation here if needed)

        try {
            await addDoc(collection(firestore, "contactMessages"), {
                name: name,
                email: email,
                number: number,
                message: message,
                timestamp: new Date() // This will store the current date and time the message was sent
            });
            showMessage('Message sent successfully!');
            document.getElementById('contact-form').reset();
        } catch (error) {
            console.error("Error sending message: ", error);
            showMessage('Failed to send message. Please try again.');
        }
    });
});
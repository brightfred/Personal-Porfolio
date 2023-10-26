// Import necessary Firebase SDK modules
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
    collection,
    doc,
    setDoc,
    query,
    where,
    getDocs,
    updateDoc,
    deleteDoc,
    serverTimestamp,
    orderBy
} from "https://www.gstatic.com/firebasejs/10.5.0/firebase-firestore.js";

// Define the configuration settings for Firebase
const firebaseConfig = {
    apiKey: "AIzaSyDd4yO0wA5ciU6Oou399F6ljpKTWqD5Y5g",
    authDomain: "personal-portfolio-fb.firebaseapp.com",
    projectId: "personal-portfolio-fb",
    storageBucket: "personal-portfolio-fb.appspot.com",
    messagingSenderId: "317729267902",
    appId: "1:317729267902:web:0f77266a41d836f04ffeef"
};

// Initialize Firebase using the provided configuration
const app = initializeApp(firebaseConfig);

// Initialize Firebase authentication and Firestore services
const auth = getAuth(app);
const firestore = getFirestore(app);

// Function to toggle a CSS class on a DOM element
function flipBox(element) {
    console.log("Function called");
    element.classList.toggle('flipped');
}

// Get references to the menu and header DOM elements
const menu = document.querySelector('#menu-bars');
const header = document.querySelector('header');

// Add click event listener to menu: toggles classes for animation
menu.onclick = () => {
    menu.classList.toggle('fa-times');
    header.classList.toggle('active');
}

// Add scroll event listener to window: remove classes from menu and header
window.onscroll = () => {
    menu.classList.remove('fa-times');
    header.classList.remove('active');
}

// Add click event listener to the comment submission button
document.getElementById('postCommentButton').addEventListener('click', submitComment);

// Function to handle comment submission
async function submitComment() {
    // Get the comment text from the input field
    const commentText = document.getElementById('commentText').value;

    // Check if the comment text is not empty
    if (!commentText.trim()) {
        showMessage('Comment cannot be empty!');
        return;
    }

    // Get the currently authenticated user
    const user = auth.currentUser;

    // If no user is authenticated, show a message
    if (!user) {
        showMessage('Please login to post a comment.');
        return;
    }

    try {
        // Reference the 'comments' collection in Firestore
        const commentsCollection = collection(firestore, 'comments');

        // Add the new comment to the collection
        await setDoc(doc(commentsCollection, `${user.uid}-${Date.now()}`), {
            text: commentText,
            timestamp: serverTimestamp(),
            author: user.displayName || user.email
        });

        // Clear the comment input field and reload comments
        document.getElementById('commentText').value = '';
        loadComments();
    } catch (error) {
        console.error('Error adding comment:', error);
        showMessage('Failed to post comment. Please try again.');
    }
}

// Add event listener to load comments when the DOM content is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    loadComments();
});

// Function to fetch and render comments from Firestore

async function loadComments() {
    // Reference to the element where comments will be displayed
    const commentsDisplay = document.getElementById('commentsDisplay');
    commentsDisplay.innerHTML = '';

    // Query the Firestore to get comments ordered by timestamp in descending order
    const commentsQuery = query(collection(firestore, 'comments'), orderBy('timestamp', 'desc'));
    const commentDocs = await getDocs(commentsQuery);

    // Iterate over each fetched comment and display it
    commentDocs.forEach(doc => {
        const commentUID = doc.id.split('-')[0];  // Extract the user UID from the comment ID
        const commentData = doc.data();

        // Create and structure the comment DOM element
        const commentDiv = document.createElement('div');
        commentDiv.className = 'comment';

        // Display the comment's author
        const commentAuthor = document.createElement('p');
        commentAuthor.className = 'comment-author';
        commentAuthor.textContent = commentData.author;
        commentDiv.appendChild(commentAuthor);

        // Display the comment's timestamp
        const commentTimestamp = document.createElement('p');
        commentTimestamp.className = 'comment-timestamp';
        commentTimestamp.textContent = new Date(commentData.timestamp.seconds * 1000).toLocaleString();
        commentDiv.appendChild(commentTimestamp);

        // Display the comment text
        const commentText = document.createElement('p');
        commentText.className = 'comment-text';
        commentText.textContent = commentData.text;
        commentDiv.appendChild(commentText);

        // Create a delete button (initially hidden)
        const deleteButton = document.createElement('button');
        const deleteIcon = document.createElement('i');
        deleteIcon.className = 'fa-regular fa-trash-can';
        deleteButton.id = 'deleteButton';
        deleteButton.appendChild(deleteIcon);
        deleteButton.style.display = 'none';
        deleteButton.addEventListener('click', () => deleteComment(doc.id));
        commentDiv.appendChild(deleteButton);

        // If the current user is the comment's author, add an edit button
        if (auth.currentUser && auth.currentUser.uid === commentUID) {
            const editButton = document.createElement('button');
            const editIcon = document.createElement('i');
            editIcon.className = 'fas fa-edit';
            editButton.appendChild(editIcon);
            editButton.addEventListener('click', () => {
                startEditingComment(commentDiv, doc.id);
                deleteButton.style.display = 'inline-block'; // Show delete button during editing
            });
            commentDiv.appendChild(editButton);
        }

        commentsDisplay.appendChild(commentDiv);
    });
}

// Function to delete a comment

async function deleteComment(commentId) {
    try {
        const commentsCollection = collection(firestore, 'comments');
        await deleteDoc(doc(commentsCollection, commentId));

        // Refresh comments after a successful deletion
        loadComments();
    } catch (error) {
        console.error('Error deleting comment:', error);
        showMessage('Failed to delete comment. Please try again.');
    }
}

// Initiate the process of editing a comment.

function startEditingComment(commentDiv, commentId) {
    // Reference to the comment text within the container
    const commentTextElement = commentDiv.querySelector('.comment-text');
    const currentText = commentTextElement.textContent;

    // Replace the comment text with a textarea and a save button
    const textarea = document.createElement('textarea');
    textarea.className = 'edit-textarea';
    textarea.value = currentText;

    const saveButton = document.createElement('button');
    saveButton.className = 'fa-regular fa-floppy-disk';
    saveButton.id = 'saveButton';
    saveButton.addEventListener('click', () => saveEditedComment(commentId, textarea, commentTextElement));

    commentTextElement.innerHTML = '';
    commentTextElement.appendChild(textarea);
    commentTextElement.appendChild(saveButton);
}

// Save the edited comment to Firestore.

async function saveEditedComment(commentId, textarea, commentTextElement) {
    const newText = textarea.value;

    // Ensure the comment is not empty
    if (!newText.trim()) {
        showMessage('Comment cannot be empty!');
        return;
    }

    try {
        // Update the comment in Firestore
        const commentsCollection = collection(firestore, 'comments');
        await updateDoc(doc(commentsCollection, commentId), { text: newText });

        // Reflect the updated comment in the DOM
        commentTextElement.innerHTML = newText;

        // Hide the delete button after a successful update
        const deleteButton = commentTextElement.parentElement.querySelector('#deleteButton');
        if (deleteButton) {
            deleteButton.style.display = 'none';
        }

        // Ensure the comment has an edit button
        const editButton = commentTextElement.parentElement.querySelector('.fa-edit');
        if (!editButton) {
            // If, for any reason, the edit button doesn't exist, recreate it
            const newEditButton = document.createElement('button');
            const editIcon = document.createElement('i');
            editIcon.className = 'fas fa-edit';
            newEditButton.appendChild(editIcon);
            newEditButton.addEventListener('click', () => {
                startEditingComment(commentTextElement.parentElement, commentId);
                deleteButton.style.display = 'inline-block';  // Show delete button during editing
            });
            commentTextElement.parentElement.appendChild(newEditButton);
        } else {
            // Ensure the edit button works correctly
            editButton.addEventListener('click', () => {
                startEditingComment(commentTextElement.parentElement, commentId);
                deleteButton.style.display = 'inline-block';
            });
        }
    } catch (error) {
        console.error('Error updating comment:', error);
        showMessage('Failed to update comment. Please try again.');
    }
}
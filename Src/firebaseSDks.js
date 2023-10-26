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

// hamburger menu for small screen (navigation bar)
const menu = document.querySelector('#menu-bars');
const header = document.querySelector('header');

// Event listener for menu button click(toggle on the navigation bar)
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
window.showMessage = function (text) {
    const messageBox = document.getElementById('messageBox');
    const messageText = document.getElementById('messageText');

    messageText.textContent = text;
    messageBox.classList.remove('hidden');
}

// Event listener for closing messageBox
document.getElementById('closeMessage').addEventListener('click', function () {
    document.getElementById('messageBox').classList.add('hidden');
});

// Get the element for the "forgot password" link.
const forgotPasswordLink = document.getElementById('forgot-password');

/* Event listener to show the forgot password box when the link is clicked.*/
if (forgotPasswordLink) {
    forgotPasswordLink.addEventListener('click', function (event) {
        event.preventDefault();
        const forgotPasswordBox = document.getElementById('forgotPasswordBox');
        forgotPasswordBox.classList.remove('hidden');
    });
}

// Get the element for the close button on the forgot password box.
const closeForgotPassword = document.getElementById('closeForgotPassword');

/* Event listener to hide the forgot password box when the close button is clicked.*/
if (closeForgotPassword) {
    closeForgotPassword.addEventListener('click', function () {
        document.getElementById('forgotPasswordBox').classList.add('hidden');
    });
}

// Get the element for the password reset submit button.
const submitButton = document.getElementById('submitButton');

/* Event listener for sending a password reset email to the provided email address.*/
if (submitButton) {
    submitButton.addEventListener('click', function () {
        const emailInput = document.getElementById('emailInput');
        const emailAddress = emailInput ? emailInput.value : '';

        if (emailAddress) {
            sendPasswordResetEmail(auth, emailAddress)
                .then(function () {
                    showMessage('Password reset email sent! Check your inbox.');
                })
                .catch(function (error) {
                    showMessage('Error: ' + error.message);
                });
        } else {
            showMessage('Please enter a valid email address.');
        }
    });
}

// Get the registration form element.
const registrationForm = document.getElementById('registration-form');

/*Event listener for the registration form submission.
It registers a new user and handles errors.*/
if (registrationForm) {
    registrationForm.addEventListener('submit', function (event) {
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

// Get references to elements related to the registration modal.
const showRegisterModalBtn = document.getElementById('show-register-modal');
const closeRegisterModalBtn = document.getElementById('close-register-modal');
const registerModal = document.getElementById('register-modal');

/* Event listeners for showing and hiding the registration modal.*/
if (showRegisterModalBtn && closeRegisterModalBtn && registerModal) {
    showRegisterModalBtn.addEventListener('click', function () {
        registerModal.style.display = 'block';
    });
    closeRegisterModalBtn.addEventListener('click', function () {
        registerModal.style.display = 'none';
    });

    // Close the modal if the user clicks outside of it.
    window.onclick = function (event) {
        if (event.target === registerModal) {
            registerModal.style.display = 'none';
        }
    };
}

/* Displays the logout confirmation message with 'Yes' and 'No' buttons.*/
function showLogoutConfirmation() {
    // Get the message box and message text DOM elements.
    const messageBox = document.getElementById('messageBox');
    const messageText = document.getElementById('messageText');

    // Remove any previously displayed buttons.
    removeExistingButtons();

    // Create 'Yes' and 'No' buttons for the logout confirmation.
    const confirmYes = document.createElement('button');
    const confirmNo = document.createElement('button');

    confirmYes.id = 'confirmYes';
    confirmNo.id = 'confirmNo';

    confirmYes.className = 'confirm-button confirm-yes';
    confirmNo.className = 'confirm-button confirm-no';

    // Set the confirmation message and button texts.
    messageText.textContent = 'Are you sure you want to log out?';
    confirmYes.textContent = 'Yes';
    confirmNo.textContent = 'No';

    // Add the buttons to the message box and display it.
    messageBox.appendChild(confirmYes);
    messageBox.appendChild(confirmNo);
    messageBox.classList.remove('hidden');

    // Attach event listeners to the buttons.
    confirmYes.addEventListener('click', function () {
        logoutUser();
    });
    confirmNo.addEventListener('click', function () {
        messageBox.classList.add('hidden');
        removeExistingButtons();
    });
}

/* Removes any existing 'Yes' and 'No' buttons from the message box.*/
function removeExistingButtons() {
    const existingYes = document.getElementById('confirmYes');
    const existingNo = document.getElementById('confirmNo');
    const messageBox = document.getElementById('messageBox');

    if (existingYes) messageBox.removeChild(existingYes);
    if (existingNo) messageBox.removeChild(existingNo);
}

/* Handles the logout process for the user.*/
function logoutUser() {
    const messageBox = document.getElementById('messageBox');
    // Hide the message box and remove any buttons.
    messageBox.classList.add('hidden');
    removeExistingButtons();

    // Attempt to log out the user.
    signOut(auth)
        .then(() => {
            showMessage('Logged out successfully!');
            location.reload();
        })
        .catch((error) => {
            console.error("Error logging out: ", error);
            showMessage('Failed to log out. Please try again.');
        });
}

/* Displays a given message to the user.*/
function showMessage(message) {
    const messageBox = document.getElementById('messageBox');
    const messageText = document.getElementById('messageText');
    messageText.textContent = message;
    messageBox.classList.remove('hidden');
}



/* Removes any existing 'Yes' and 'No' buttons from the message box.*/
function removeExistingYesNoButtons() {
    const existingYes = document.getElementById('confirmYes');
    const existingNo = document.getElementById('confirmNo');
    const messageBox = document.getElementById('messageBox');

    if (existingYes) messageBox.removeChild(existingYes);
    if (existingNo) messageBox.removeChild(existingNo);
}

/* Handles the logout process for the user.*/
function logoutUsers() {
    const messageBox = document.getElementById('messageBox');
    // Hide the message box and remove any buttons.
    messageBox.classList.add('hidden');
    removeExistingButtons();

    // Attempt to log out the user.
    signOut(auth)
        .then(() => {
            showMessage('Logged out successfully!');
            location.reload();
        })
        .catch((error) => {
            console.error("Error logging out: ", error);
            showMessage('Failed to log out. Please try again.');
        });
}

// Get reference to the login form
const loginForm = document.getElementById('login-form');

if (loginForm) {
    loginForm.addEventListener('submit', function (event) {
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

// Search functionality

// Function to initialize event listeners once DOM is loaded

function initialize() {
    const searchButton = document.querySelector('.searchButton');
    const searchInput = document.getElementById('searchInput');
    // Event listener for input to trigger autocomplete
    searchInput.addEventListener('input', executeAutocomplete);  // Add listener for autocomplete
    // Event listener for button click
    searchButton.addEventListener('click', executeSearch);

    // Event listener for 'Enter' key in input field
    searchInput.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            executeSearch();
        }
    });
}

// Function to populate the tags dropdown
function populateTagsDropdown() {
    const tagDropdown = document.getElementById('tagDropdown');
    tagsArray.forEach(tag => {
        const option = document.createElement('option');
        option.value = tag.toLowerCase();
        option.textContent = tag;
        tagDropdown.appendChild(option);
    });
}

// Event listener for autocomplete suggestions click
document.getElementById('suggestionsContainer').addEventListener('click', function (event) {
    const selectedSuggestion = event.target.textContent;
    document.getElementById('searchInput').value = selectedSuggestion;
    executeSearch();
});

// Call initialize function once DOM is loaded
document.addEventListener('DOMContentLoaded', initialize);

// Function to index a page
function indexPage(pageData) {
    const pageRef = doc(collection(firestore, 'pages'), pageData.title.replace(/\s+/g, '-').toLowerCase());
    setDoc(pageRef, pageData)
        .then(() => {
            console.log("Page indexed successfully");
        })
        .catch((error) => {
            console.error("Error indexing page: ", error);
        });
}

// Call indexPage on page load or content update with the necessary page data

const pagesData = [
    {
        title: "About-Me",
        url: "../about-me/about-me.html",
        content: "(2023-2026) Diploma: Information Technology I pursued a diploma in Information Technology at NMIT, New Zealand. Preparing me for new challenges and opportunities. (2015-2017) Diploma:Business Management Pursed in Canada,this program equipped me with business and financial knowledge . (2011-2014) Diploma: Fire Science I undertook a Diploma in Fire Science, where I gained essential insights into fire safety and emergency management. (2023-2026) Web developer I focused on becoming a skilled web developer. This period marked my exploration of coding, honing expertise in HTML, CSS, JavaScript, and beyond. (2015-2022) Agricultural Accounting and Management Honing financial acumen and strategic insights within the dynamic agricultural sector. (2014-2019) Firefighter Explored firefighting, nurturing resilience and teamwork. Gained crisis management skills that amplify my adaptability.",
        tags: ["Education", "Diploma", "Agriculture", "Finance", "Web Developer", "Firefighter", "NMIT", "Canada", "New Zealand", "Agricultural Accounting and Management", "Fire Science Diploma", "Business Management Diploma", "Information Technology Diploma"]
    },
    {
        title: "home-page",
        url: "../home-page/home-page.html",
        content: "WEB502 I AM FREDERICK LAROCHE Bachelor of Information Technology I'm an enthusiastic learner with a background covering multiple fields. My passion lies in continuous skill improvement, demonstrated by my three diplomas. I thrive on problem-solving and enjoy supporting others in achieving their goals. I hold a strong interest in finance, economics, technology, and software development, including HTML, CSS, databases, and JavaScript. I aspire to step into the role of a web developer in the coming years.",
        tags: ["WEB502", "Frederick Laroche", "Bachelor of Information Technology", "web developer", "HTML", "CSS", "JavaScript", "databases", "finance", "economics", "technology", "software development"]
    },
    {
        title: "Contact-Me",
        url: "../contact/contact.html",
        content: "CONTACT ME Email Frederick-laroche@live.nmit.ac.nz GitHub Username : Brightfred Address Nelson , New zealand Name Email Number Write Your Message ",
        tags: ["Contact", "Email", "GitHub", "Address", "Nelson, New Zealand", "Message", "Frederick Laroche", "Brightfred"]
    },
    {
        title: "Login",
        url: "../login/login.html",
        content: "Login Email: Password: Forgot Password? Don't have an account? Register Google Facebook GitHub",
        tags: ["login", "authentication", "sign in", "access", "user", "account"]
    },
    {
        title: "My-Projects",
        url: "../project/project.html",
        content: "Participating in community engagement events like fire station tours, safety fairs to interact with local residents and advocate for fire safety measures. Skill applied : Public Speaking, CRYPTOCURRENCY 2020 - 2022 I have given basic formation on cryptocurrency and blockchain technology to almost 100 people. Skill applied : Learning Agility CLIENT DATABASE 2018 - 2021 I built a client database for my friend's chimney cleaning company in excel and maintained it. Skill applied : Documentation FINANCIAL CONSULTANT 2019 - 2022 I provided valuable insights and guidance to individuals seeking financial expertise. I was helping clients make informed decisions. Skill applied : Adaptability FARM DATABASE 2017 - 2022 Build a database for my father’s farm as he was doing everything with excel, I wanted to upgrade his system with SQL lite. Skill applied : Self-Teaching CODE LEARNING 2023 - 2023 I am learning Coding to improve my skill with Free code camp and flex-box and flex grid zombies game. Skill applied : Continuous learning",
        tags: ["projects", "Agriculture", "Finance", "portfolio", "firefighter", "cryptocurrency", "client database", "financial consultant", "farm database", "code learning", "web development", "database", "finance", "agriculture"]
    },
    {
        title: "My-Skills",
        url: "../skill/skill.html",
        content: "MY TECHNICAL SKILLS HTML 60% CSS 80% JavaScript 35% MySQL 80% MY SOFT SKILLS Learning agility Self-teaching Problem-solving Critical thinking Public speaking Adaptability",
        tags: ["technical skills", "HTML", "CSS", "MySQL", "soft skills", "learning agility", "self-teaching", "problem-solving", "critical thinking", "public speaking", "adaptability"]
    }
];

// Index each page from the `pagesData` array
pagesData.forEach((pageData) => indexPage(pageData));

// Function to search Firestore based on input and optionally, a selected tag
const executeSearch = (searchTermOverride) => {
    // Get the search term either from the argument or from the input element
    const searchTerm = searchTermOverride || document.getElementById('searchInput').value;

    // Reference to the Firestore collection of pages
    const pagesCollection = collection(firestore, 'pages');

    // Get the currently selected tag from the dropdown, if it exists
    const selectedTagDropdown = document.getElementById('selectedTagDropdown');
    const selectedTag = selectedTagDropdown ? selectedTagDropdown.value : null;

    // Create a query to Firestore based on search term and, if available, a selected tag
    let q;
    if (selectedTag) {
        q = query(
            pagesCollection,
            where('tags', 'array-contains', searchTerm),
            where('tags', 'array-contains', selectedTag)
        );
    } else {
        q = query(pagesCollection, where('tags', 'array-contains', searchTerm));
    }

    // Execute the query to Firestore
    getDocs(q)
        .then((querySnapshot) => {
            const results = [];
            querySnapshot.forEach((doc) => {
                results.push(doc.data());
            });

            // If a tag is selected, further filter the results by that tag
            if (selectedTag) {
                results = results.filter(result => result.tags.includes(selectedTag));
            }

            // Display the results or a 'no results' message
            if (results.length > 0) {
                displayResults(results);
            } else {
                noResultsFeedback();
            }
        })
        .catch((error) => {
            console.error('Error getting documents: ', error);
            errorFeedback();
        });
};

// Function to display search results
const displayResults = (results) => {
    const resultsContainer = document.getElementById('resultsContainer');
    resultsContainer.innerHTML = '';

    results.forEach((result) => {
        const resultDiv = document.createElement('div');
        resultDiv.className = 'result';

        const resultLink = document.createElement('a');
        resultLink.href = result.url;
        resultLink.textContent = result.title;

        resultDiv.appendChild(resultLink);
        resultsContainer.appendChild(resultDiv);
    });
};

// Function to display no results feedback
const noResultsFeedback = () => {
    const resultsContainer = document.getElementById('resultsContainer');
    resultsContainer.innerHTML = '<p>No results found.</p>';
};

// Function to display error feedback
const errorFeedback = () => {
    const resultsContainer = document.getElementById('resultsContainer');
    resultsContainer.innerHTML = '<p>An error occurred while searching. Please try again.</p>';
};

const executeAutocomplete = () => {
    const tagsArray = [
        'Education', 'Web Developer', 'Agriculture', 'Finance', 'Experience',
        'Diploma', 'login', 'account', 'projects', 'HTML', 'Email',
        'Message', 'soft skills', 'technical skills', 'CSS', 'Contact',
    ];

    const searchTerm = document.getElementById('searchInput').value;
    const suggestionsContainer = document.getElementById('suggestionsContainer');
    suggestionsContainer.innerHTML = '';

    if (searchTerm) {
        let hasSuggestions = false;

        tagsArray.forEach((tag) => {
            if (tag.toLowerCase().includes(searchTerm.toLowerCase())) {
                hasSuggestions = true;

                const suggestionItem = document.createElement('div');
                suggestionItem.textContent = tag;

                suggestionItem.addEventListener('click', () => {
                    document.getElementById('searchInput').value = tag;
                    executeSearch(tag);
                    suggestionsContainer.style.display = 'none';
                });

                suggestionsContainer.appendChild(suggestionItem);
            }
        });

        suggestionsContainer.style.display = hasSuggestions ? 'block' : 'none';
    } else {
        suggestionsContainer.style.display = 'none';
    }
};

// Add a click listener to handle selection of autocomplete suggestions
document.getElementById('suggestionsContainer').addEventListener('click', (event) => {
    const selectedSuggestion = event.target.textContent;
    document.getElementById('searchInput').value = selectedSuggestion;
    executeSearch();
});


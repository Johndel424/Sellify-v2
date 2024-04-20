const firebaseConfig = {
    apiKey: "AIzaSyDCELekaelvtROWv6lL_JaJwJ6LOwSGgUs",
    authDomain: "sellify-493fa.firebaseapp.com",
    databaseURL: "https://sellify-493fa-default-rtdb.firebaseio.com",
    projectId: "sellify-493fa",
    storageBucket: "sellify-493fa.appspot.com",
    messagingSenderId: "479130711275",
    appId: "1:479130711275:web:009adba18cee85b296faae"
        };

        // Initialize Firebase
        firebase.initializeApp(firebaseConfig);

        // Get the chat room ID from the URL query parameter
        const urlParams = new URLSearchParams(window.location.search);
        const chatRoomId = urlParams.get('chatRoomId');

        // Reference to the Firebase database
        const database = firebase.database();

        // Reference to the chat room in the database
        const chatRoomRef = database.ref("messages/" + chatRoomId);

        // Function to display chat messages
        function displayMessage(message) {
            const chatArea = document.getElementById('chatArea');
            const messageElement = document.createElement('div');
            messageElement.textContent = message;
            chatArea.appendChild(messageElement);
        }

        // Listen for new messages in the chat room
        chatRoomRef.on('child_added', (snapshot) => {
            const message = snapshot.val();
            displayMessage(message);
        });

        // Function to send a message
document.getElementById('sendMessageButton').addEventListener('click', function() {
    const messageInput = document.getElementById('messageInput');
    const defaultMessage = "Offered Price: ";
    const messageText = messageInput.value.trim();
    const usermessage = defaultMessage + messageText;
    if (messageText !== '') {
        // Get the current user
        const currentUser = firebase.auth().currentUser;
        if (currentUser) {
            // Reference to the user's data in the database
            const userRef = firebase.database().ref('users/' + currentUser.uid);
            // Retrieve user data from the database
            userRef.once('value', (snapshot) => {
                const userData = snapshot.val();
                if (userData) {
                    const username = userData.username;
                    const profileImg = userData.profileImageUrl;
                    // Save the message to the chat room in the database
                    chatRoomRef.push({
                        senderUid: currentUser.uid,
                        senderUsername: username,
                        senderProfileImg: profileImg,
                        text: usermessage,
                        timestamp: firebase.database.ServerValue.TIMESTAMP
                    })
                    .then(() => {
                        messageInput.value = ''; // Clear the message input field
                    })
                    .catch((error) => {
                        console.error('Failed to send message:', error);
                        alert("Failed to send message: " + error.message);
                    });
                } else {
                    console.error('User data not found.');
                    alert("User data not found.");
                }
            });
        } else {
            console.error('No user logged in.');
            alert("No user logged in.");
        }
    }
});
// Set the currentUserUid variable with the UID of the current user
let currentUserUid;
firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        currentUserUid = user.uid;
        
        // Dito mo maaaring tawagin ang displayMessage function o iba pang mga functions na gumagamit ng currentUserUid
    } else {
        // Walang naka-login na user
    }
});

function displayMessage(message) {
    const chatArea = document.getElementById('chatArea');
    const messageElement = document.createElement('div');
    const msgImgElement = document.createElement('div');
    const msgBubbleElement = document.createElement('div');
    const msgInfoElement = document.createElement('div');
    const msgInfoNameElement = document.createElement('div');
    const msgTextElement = document.createElement('div');
    
    messageElement.classList.add('msg');
    
    if (message.senderUid === currentUserUid) {
        messageElement.classList.add('right-msg');
    } else {
        messageElement.classList.add('left-msg');
    }

    msgImgElement.classList.add('msg-img');
    msgImgElement.style.backgroundImage = `url(${message.senderProfileImg})`;

    msgBubbleElement.classList.add('msg-bubble');
    
    msgInfoElement.classList.add('msg-info');
    
    msgInfoNameElement.classList.add('msg-info-name');
    msgInfoNameElement.textContent = message.senderUsername;

    msgTextElement.classList.add('msg-text');
    msgTextElement.textContent = message.text;

    msgInfoElement.appendChild(msgInfoNameElement);
    msgBubbleElement.appendChild(msgInfoElement);
    msgBubbleElement.appendChild(msgTextElement);
    messageElement.appendChild(msgImgElement);
    messageElement.appendChild(msgBubbleElement);
    chatArea.appendChild(messageElement);
}


// Function to display the header with other user details
function displayHeader(otherUserData) {
    // Create header HTML
    const headerHtml = `
        <div id="header" class="msg-text">
            <img src="${otherUserData.profileImg}" alt="Profile Image">
            <span>${otherUserData.username}</span>
        </div>
    `;

    // Inject header HTML into the page
    document.getElementById('headerContainer').innerHTML = headerHtml;
}


// Function to retrieve other user's username and profile image from Firebase
function getOtherUserData(chatRoomId) {
    // Reference to the chat room ID in the database
    const chatRoomRef = database.ref("chatrooms/" + chatRoomId);

    // Retrieve chat room data from Firebase
    chatRoomRef.once('value', (snapshot) => {
        const chatRoomData = snapshot.val();
        if (chatRoomData) {
            const otherUid = chatRoomData.uid;

            // Reference to the other user's data in the database
            const otherUserRef = database.ref('chatrooms/' + chatRoomId);

            // Retrieve other user's data from Firebase
            otherUserRef.once('value', (snapshot) => {
                const otherUserData = snapshot.val();
                if (otherUserData) {
                    // Call the displayHeader function to show the header with the other user's profile image and username
                    // displayHeader({
                    //     profileImg: otherUserData.otherUserImg,
                    //     username: otherUserData.otherUsername
                    // });
                    // Assuming otherUserData contains the data of the other user
                    if (otherUserData.otherId === currentUserUid) {
                        displayHeader({
                            profileImg: otherUserData.currentUserImg,
                            username: otherUserData.currentUserUsername
                        });
                    } else {
                        displayHeader({
                            profileImg: otherUserData.otherUserImg,
                            username: otherUserData.otherUsername
                        });
                    }
                } else {
                    console.error('Other user data not found.');
                }
            });
        } else {
            console.error('Chat room data not found.');
        }
    });
}
firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    // User is signed in, get the user ID
    var uid = user.uid;
    
    // Reference to the user's profile in the database
    var userProfileRef = firebase.database().ref('users/' + uid);

    // Get the profile data from the database
    userProfileRef.once('value').then(function(snapshot) {
      var profileData = snapshot.val(); // Makuha ang lahat ng data ng profile
      
      // Get the profile image URL
      var profileImgUrl = profileData.profileImageUrl;

      // Get the username
      var username = profileData.username;

      // Set the profile image src attribute
      if (profileImgUrl) { 
        document.getElementById('userProfileImage').src = profileImgUrl;
      }

      // Set the username inside the div
      if (username) {
        document.getElementById('usernameParagraph').innerText = username;
      }
    }).catch(function(error) {
      console.log("Error fetching user data:", error);
    });
  } else {
    // No user is signed in.
    console.log("No user is signed in.");
  }
});
// Call the function to get other user's data and display the header
getOtherUserData(chatRoomId);


const allSideMenu = document.querySelectorAll('#sidebar .side-menu.top li a');

allSideMenu.forEach(item=> {
	const li = item.parentElement;

	item.addEventListener('click', function () {
		allSideMenu.forEach(i=> {
			i.parentElement.classList.remove('active');
		})
		li.classList.add('active');
	})
});

const db = firebase.database();

      
// Get a reference to the Firebase Authentication service
const auth = firebase.auth();

// Check if a user is currently signed in
auth.onAuthStateChanged(user => {
    if (user) {
        // User is signed in, get their UID
        const currentUserId = user.uid;
        // Now you can use currentUserId in your code
        console.log("Current user ID:", currentUserId);
        
        // Call your function to retrieve chat rooms here, passing currentUserId
        retrieveChatRooms(currentUserId);
    } else {
        // No user is signed in
        console.log("No user signed in.");
    }
});

function retrieveChatRooms(currentUserId, currentUserUsername) {
    const chatRoomsRef = db.ref('chatrooms');

    // Query for chat rooms where otherId is currentUserId
    const query1 = chatRoomsRef.orderByChild('otherId').equalTo(currentUserId).once('value');

    // Query for chat rooms where userId is currentUserId
    const query2 = chatRoomsRef.orderByChild('userId').equalTo(currentUserId).once('value');

    // Execute both queries asynchronously using Promise.all
    Promise.all([query1, query2])
        .then(results => {
            const chatRoomsList = document.getElementById('chatRoomsList');

            results.forEach(snapshot => {
                snapshot.forEach(childSnapshot => {
                    const chatRoomData = childSnapshot.val();
                    const chatRoomId = childSnapshot.key;
                    let profileImgUrl;

                    // Check if the current user is the user or the other user
                    if (chatRoomData.otherId === currentUserId) {
                        profileImgUrl = chatRoomData.currentUserImg;
                    } else {
                        profileImgUrl = chatRoomData.otherUserImg;
                    }

                    // Create list item element
                    const listItem = document.createElement('li');
                    listItem.classList.add('listItem');

                    // Create container for profile image
                    const profileImgContainer = document.createElement('div');
                    profileImgContainer.classList.add('profileImagesContainer');

                    if (profileImgUrl) {
                        // Create image element for the profile image
                        const imgElement = document.createElement('img');
                        imgElement.src = profileImgUrl;
                        imgElement.alt = "Profile Image";
                        imgElement.style.width = "50px"; // Set width to desired size
                        imgElement.style.height = "50px";

                        // Append image element to profile image container
                        profileImgContainer.appendChild(imgElement);
                    } else {
                        console.error(`No profile image found for chat room ${chatRoomId}`);
                    }
                    if (chatRoomData.otherId === currentUserId) {
                        listItem.textContent = `${chatRoomData.currentUserUsername}`;
                    } else {
                        listItem.textContent = `${chatRoomData.otherUsername}`;
                    }

                    // Append profile image container to list item
                    listItem.appendChild(profileImgContainer);

                    // Add click event listener to list item
                    listItem.addEventListener('click', function() {
                        // Redirect to message.html with chatRoomId as parameter
                        window.location.href = `message.html?chatRoomId=${encodeURIComponent(chatRoomId)}`;
                    });

                    // Append list item to unordered list
                    chatRoomsList.appendChild(listItem);
                });
            });
        })
        .catch(error => {
            console.error("Error retrieving chat rooms:", error);
        });
}

// TOGGLE SIDEBAR
const menuBar = document.querySelector('#content nav .bx.bx-menu');
const sidebar = document.getElementById('sidebar');

menuBar.addEventListener('click', function () {
	sidebar.classList.toggle('hide');
})



const searchButton = document.querySelector('#content nav form .form-input button');
const searchButtonIcon = document.querySelector('#content nav form .form-input button .bx');
const searchForm = document.querySelector('#content nav form');

searchButton.addEventListener('click', function (e) {
	if(window.innerWidth < 576) {
		e.preventDefault();
		searchForm.classList.toggle('show');
		if(searchForm.classList.contains('show')) {
			searchButtonIcon.classList.replace('bx-search', 'bx-x');
		} else {
			searchButtonIcon.classList.replace('bx-x', 'bx-search');
		}
	}
})





if(window.innerWidth < 768) {
	sidebar.classList.add('hide');
} else if(window.innerWidth > 576) {
	searchButtonIcon.classList.replace('bx-x', 'bx-search');
	searchForm.classList.remove('show');
}


window.addEventListener('resize', function () {
	if(this.innerWidth > 576) {
		searchButtonIcon.classList.replace('bx-x', 'bx-search');
		searchForm.classList.remove('show');
	}
})



const switchMode = document.getElementById('switch-mode');

switchMode.addEventListener('change', function () {
	if(this.checked) {
		document.body.classList.add('dark');
	} else {
		document.body.classList.remove('dark');
	}
})


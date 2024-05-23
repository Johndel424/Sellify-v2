const firebaseConfig = {
    apiKey: "AIzaSyDCELekaelvtROWv6lL_JaJwJ6LOwSGgUs",
    authDomain: "sellify-493fa.firebaseapp.com",
    databaseURL: "https://sellify-493fa-default-rtdb.firebaseio.com",
    projectId: "sellify-493fa",
    storageBucket: "sellify-493fa.appspot.com",
    messagingSenderId: "479130711275",
    appId: "1:479130711275:web:009adba18cee85b296faae"
};
firebase.initializeApp(firebaseConfig);

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
                      imgElement.style.width = "40px"; // Set width to desired size
                      imgElement.style.height = "40px";

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
function logoutUser() {
    firebase.auth().signOut().then(() => {
      // Sign-out successful.
      //alert("User logged out successfully!");
      window.location = 'index.html'; // Redirect to login page after logout
    }).catch((error) => {
      // An error happened.
      console.error("Logout Error:", error);
      alert("Error logging out!");
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
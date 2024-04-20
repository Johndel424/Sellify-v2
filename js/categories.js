 // Initialize Firebase
 var firebaseConfig = {
    apiKey: "AIzaSyDCELekaelvtROWv6lL_JaJwJ6LOwSGgUs",
    authDomain: "sellify-493fa.firebaseapp.com",
    databaseURL: "https://sellify-493fa-default-rtdb.firebaseio.com",
    projectId: "sellify-493fa",
    storageBucket: "sellify-493fa.appspot.com",
    messagingSenderId: "479130711275",
    appId: "1:479130711275:web:009adba18cee85b296faae"
};
firebase.initializeApp(firebaseConfig);

// Reference to items in the database
var itemsRef = firebase.database().ref('Items');

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
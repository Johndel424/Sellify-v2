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

function registerUser(email, password, username, profileImg) {
  firebase.auth().createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      // Registration successful
      alert("User created successfully!");

      // Get the user ID of the newly registered user
      var userId = userCredential.user.uid;

      // Reference to the storage bucket
      var storageRef = firebase.storage().ref();

      // Upload the profile image to Firebase Storage
      var imgRef = storageRef.child('profileImages/' + userId + '.jpg');
      imgRef.put(profileImg).then((snapshot) => {
        // Get the download URL for the profile image
        imgRef.getDownloadURL().then((downloadURL) => {
          // Reference to the database
          var usersRef = firebase.database().ref("users");

          // Save the details of the new user to the database
          usersRef.child(userId).set({
            uid: userId,
            email: email,
            username: username,
            profileImg: downloadURL
          })
          .then(() => {
            console.log("User details saved successfully to database");
          })
          .catch((error) => {
            console.error("Error saving user details to database:", error);
            alert("Error saving user details to database");
          });
        });
      });
    })
    .catch((error) => {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      console.error("Error creating user:", errorMessage);
      alert(errorMessage);
    });
}

document.getElementById("registerForm").addEventListener("submit", function(e) {
  e.preventDefault();
  var email = document.getElementById("email").value;
  var password = document.getElementById("password").value;
  var username = document.getElementById("username").value;
  var profileImg = document.getElementById("profilePic").files[0]; // Get the first file from the input
  registerUser(email, password, username, profileImg);
});


function loginUser(event) {
  event.preventDefault();
  var email = document.getElementById('loginEmail').value;
  var password = document.getElementById('loginPassword').value;
  
  firebase.auth().signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      // Signed in
      var user = userCredential.user;
      console.log("Login successful:", user);
      // Redirect to home.html after successful login
      window.location.href = "home.html";
    })
    .catch((error) => {
      var errorCode = error.code;
      var errorMessage = error.message;
      console.error("Login error:", errorMessage);
      // Handle login error, show error message, etc.
    });
}



//Check if user is already logged in or not on page load
document.addEventListener("DOMContentLoaded", function() {
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      // User is signed in, redirect to home.html
      window.location = 'home.html';
    } else {
      // No user is signed in, stay on index.html for login or registration
      // Optionally, you can add logic here if you need to show or hide elements based on login status
    }
  });
});


document.getElementById("loginForm").addEventListener("submit", function(e) {
  e.preventDefault();
  var email = document.getElementById("loginEmail").value;
  var password = document.getElementById("loginPassword").value;
  loginUser(email, password);
});
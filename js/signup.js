function previewImage() {
    var reader = new FileReader();
    reader.onload = function(e) {
      document.getElementById('profilePicPreview').src = e.target.result;
    }
    reader.readAsDataURL(document.getElementById('profilePic').files[0]);
  }
  document.getElementById("loginBtn").addEventListener("click", function() {
  window.location.href = "index.html";
});
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
          Swal.fire({
      title: "Creating account",
      text: "Successful",
      icon: "success",
      showConfirmButton: true,
      confirmButtonText: "OK"
    }).then((result) => {
      if (result.isConfirmed) {
        //window.location.href = "home.html"; // Redirect to home.html after successful registration
      }
    });

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
          profileImageUrl: downloadURL
        })
        .then(() => {
          console.log("User details saved successfully to database");
          window.location.href = "home.html"; // Redirect to home.html after saving user details to the database
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
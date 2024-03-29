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



// function loginUser(event) {
//   event.preventDefault();
//   var email = document.getElementById('loginEmail').value;
//   var password = document.getElementById('loginPassword').value;
  
//   firebase.auth().signInWithEmailAndPassword(email, password)
//     .then((userCredential) => {
//       // Signed in
//       var user = userCredential.user;
//       console.log("Login successful:", user);
//       // Redirect to home.html after successful login
//       window.location.href = "home.html";
//     })
//     .catch((error) => {
//       var errorCode = error.code;
//       var errorMessage = error.message;
//       console.error("Login error:", errorMessage);
//       // Handle login error, show error message, etc.
//     });
// }

function loginUser(event) {
  event.preventDefault();
  var email = document.getElementById('loginEmail').value;
  var password = document.getElementById('loginPassword').value;
  
  firebase.auth().signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      // Signed in
      var user = userCredential.user;
      console.log("Login successful:", user);
      // Show success message using SweetAlert
      Swal.fire({
        title: "Login Successful",
        text: "Click OK to continue...",
        icon: "success",
        showConfirmButton: true, // Show OK button
        allowOutsideClick: false // Prevent dismissing modal by clicking outside
      }).then((result) => {
        if (result.isConfirmed) {
          // Redirect to home.html after clicking OK
          window.location.href = "home.html";
        }
      });
    })
    .catch((error) => {
      var errorCode = error.code;
      var errorMessage = error.message;
      console.error("Login error:", errorMessage);
      // Show error message using SweetAlert
      Swal.fire({
        title: "Login Error",
        text: errorMessage,
        icon: "error",
        confirmButtonText: "OK"
      });
    });
}

// Check if user is already logged in or not on page load
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


// document.getElementById("loginForm").addEventListener("submit", function(e) {
//   e.preventDefault();
//   var email = document.getElementById("loginEmail").value;
//   var password = document.getElementById("loginPassword").value;
//   loginUser(email, password);
// });

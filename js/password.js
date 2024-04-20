  // Firebase configuration
  var firebaseConfig = {
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
  
          // Function to reset password
          function resetPassword() {
              var email = document.getElementById("email").value;
  
              firebase.auth().sendPasswordResetEmail(email)
                  .then(function() {
                      // Password reset email sent.
                     // document.getElementById("reset-status").innerText = "Password reset email sent successfully!";
                      // Display success message
                      Swal.fire({
                          position: "center",
                          icon: "success",
                          title: "Password reset email sent successfully!",
                          showConfirmButton: false,
                          timer: 1500
                      });
                  })
                  .catch(function(error) {
                      // Error occurred. Handle error here.
                      var errorCode = error.code;
                      var errorMessage = error.message;
                      console.error(errorCode, errorMessage);
                     // document.getElementById("reset-status").innerText = errorMessage;
                      // Display error message
                      Swal.fire({
                          position: "center",
                          icon: "error",
                          title: "Error resetting password",
                          text: errorMessage,
                          showConfirmButton: false,
                          timer: 1500
                      });
                  });
          }
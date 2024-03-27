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
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);

    // Function to populate Sub-Category dropdown based on selected Category
    function populateSubCategory(category) {
        var subCategoryDropdown = document.getElementById("subCategory");
        subCategoryDropdown.innerHTML = ""; // Clear previous options

        // Populate options based on selected category
        if (category === "Women Fashion") {
            // Add options for Category 1
            var options = ["Sub-Category 1.1", "Sub-Category 1.2", "Sub-Category 1.3"];
            options.forEach(function(option) {
                var optionElement = document.createElement("option");
                optionElement.value = option;
                optionElement.textContent = option;
                subCategoryDropdown.appendChild(optionElement);
            });
        } else if (category === "Men Fashion") {
            // Add options for Category 2
            var options = ["Sub-Category 2.1", "Sub-Category 2.2", "Sub-Category 2.3"];
            options.forEach(function(option) {
                var optionElement = document.createElement("option");
                optionElement.value = option;
                optionElement.textContent = option;
                subCategoryDropdown.appendChild(optionElement);
            });
        } else if (category === "Baby and Kids") {
            // Add options for Category 3
            var options = ["Sub-Category 3.1", "Sub-Category 3.2", "Sub-Category 3.3"];
            options.forEach(function(option) {
                var optionElement = document.createElement("option");
                optionElement.value = option;
                optionElement.textContent = option;
                subCategoryDropdown.appendChild(optionElement);
            });
        }
    }

    // Event listener for changes in Category dropdown
    document.getElementById("category").addEventListener("change", function() {
        var selectedCategory = this.value;
        populateSubCategory(selectedCategory); // Populate Sub-Category dropdown based on selected Category
    });

// Function to save user data to Firebase
function saveUserData(dataTitle, category, dataDesc, dataImage, dataLang, subCategory, profileImgUrl, username) {
    var database = firebase.database();
    var storageRef = firebase.storage().ref();

    // Get the user's location
    navigator.geolocation.getCurrentPosition(function(position) {
        var latitude = position.coords.latitude;
        var longitude = position.coords.longitude;

        // Upload the data image to Firebase Storage
        var currentDate = new Date();
        var timestamp = currentDate.getTime(); // Timestamp in milliseconds

        // Create a new file name with timestamp
        var imgRef = storageRef.child('Images/' + timestamp + '.jpg');
        imgRef.put(dataImage).then((snapshot) => {
            // Get the download URL for the data image
            imgRef.getDownloadURL().then((downloadURL) => {
                // Set the data under the dataTitle as the ID
                database.ref("itemss/" + dataTitle).set({
                    category: category,
                    dataDesc: dataDesc,
                    dataImage: downloadURL, // Add the download URL of data image to the object
                    dataLang: dataLang,
                    subCategory: subCategory,
                    latitude: latitude,
                    longitude: longitude,
                    profileImgUrl: profileImgUrl, // Add the profile image URL
                    username: username // Add the username
                })
                .then(() => {
                    console.log("User data saved successfully to the database");
                    // Optionally, you can redirect the user to another page after successful data saving
                })
                .catch((error) => {
                    console.error("Error saving user data to the database:", error);
                    alert("Error saving user data to the database");
                });
            });
        });
    }, function(error) {
        console.error("Error getting user's location:", error);
        alert("Error getting user's location");
    });
}

// Event listener for form submission
document.getElementById("registerForm").addEventListener("submit", function(e) {
    e.preventDefault(); // Prevent default form submission

    // Get form data
    var dataTitle = document.getElementById("dataTitle").value;
    var category = document.getElementById("category").value;
    var dataDesc = document.getElementById("dataDesc").value;
    var dataImage = document.getElementById("dataImage").files[0];
    var dataLang = document.getElementById("dataLang").value;
    var subCategory = document.getElementById("subCategory").value;

    // Call function to save user data
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            // User is signed in, get the user ID
            var uid = user.uid;

            // Reference to the user's profile in the database
            var userProfileRef = firebase.database().ref('users/' + uid);

            // Get the profile data from the database
            userProfileRef.once('value').then(function(snapshot) {
                var profileData = snapshot.val(); // Get all profile data
                
                // Get the profile image URL and username
                var profileImgUrl = profileData.profileImg;
                var username = profileData.username;

                // Call function to save user data, including profile information
                saveUserData(dataTitle, category, dataDesc, dataImage, dataLang, subCategory, profileImgUrl, username);
            }).catch(function(error) {
                console.error("Error fetching user profile data:", error);
                alert("Error fetching user profile data");
            });
        }
    });
});

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
      var profileImgUrl = profileData.profileImg;

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
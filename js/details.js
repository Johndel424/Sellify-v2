  // Initialize Firebase
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

         // Get the item ID from the URL query parameter
         const urlParams = new URLSearchParams(window.location.search);
        const itemId = urlParams.get('itemId');

        // Reference to the Firebase database
        const database = firebase.database();

        // Reference to the item in the database
        const itemRef = database.ref("Items/" + itemId);

       // Fetch item details from Firebase
itemRef.once('value', (snapshot) => {
    const item = snapshot.val();
    if (item) {
        // Construct HTML to display item details
        const itemHtml = `
            <div class="item" style="display: flex; flex-wrap: wrap; justify-content: center; align-items: flex-start;">
                <div class="left-column" style="flex: 1; min-width: 100%; max-width: 100%; margin: 0 auto;">
                    <img src='${item.dataImage}' alt="" style="width: 200px; height: 200px;">
                </div>
                <div class="right-column" style="flex: 1; min-width: 100%; padding: 20px; margin: 0 auto;">
                    <p style="font-family: Arial, sans-serif; font-size: 30px; font-weight: bold; text-transform: uppercase; text-align: center;">${item.dataTitle}</p>
                    <h3 style="text-align: center;">${item.dataLang}</h3>
                    <p style="text-align: center;">${item.category}</p>
                    <p style="text-align: center;">${item.status}</p>
             
                    <p class="desc" style="text-align: center; font-family: Arial, sans-serif; font-size: 16px;">${item.dataDesc}</p>
                    <div style="display: flex; justify-content: center; align-items: center; margin-top: 10px;">
                        <div class="circle-pic" style="margin-right: 10px;">
                            <img src="${item.profile}" alt="" style="border-radius: 50%; width: 30px; height: 30px;">
                        </div>
                        <p>${item.username}</p>
                    </div>
                    <!-- Buttons Section -->
                    <div class="distance-container" id="distanceContainer"></div>
                    <div class="buttons" style="text-align: center; margin-top: 10px;">
                        <button id="deleteButton" style="padding: 10px 20px; margin-right: 5px; background-color: #f44336; color: white; border: none; border-radius: 5px; cursor: pointer;">Delete</button>
                        <button id="editButton" style="padding: 10px 20px; margin-right: 5px; background-color: #f44336; color: white; border: none; border-radius: 5px; cursor: pointer;">SOLD</button>
                    </div>
                    <p style="display: none;">${item.subCategory}</p>
                    <p style="display: none;">${item.uid}</p>
                    <p style="display: none;">${item.latitude}</p>
                    <p style="display: none;">${item.longitude}</p>
                </div>
            </div>
        `;

        getLocationAndComputeDistance(item.latitude, item.longitude);
        // Inject the HTML into the page
        document.getElementById('itemDetails').innerHTML = itemHtml;
        // Add event listener to the edit button
document.getElementById('editButton').addEventListener('click', function() {
    // Reference to the Firebase database
    const database = firebase.database();

    // Reference to the item in the database
    const itemRef = database.ref("Items/" + itemId);

    // Update the item's status to "Sold"
    itemRef.update({
        status: "Sold"
    })
    .then(function() {
        console.log("Item status updated to 'Sold'");
        // Redirect the user to the edit page, passing the item ID as a query parameter
        window.location.href = "home.html" ;
    })
    .catch(function(error) {
        console.error("Error updating item status: ", error);
    });
});

 // Add event listener to the delete button
 document.getElementById('deleteButton').addEventListener('click', function() {
            // Confirm deletion with user
            if (confirm("Are you sure you want to delete this item?")) {
                // Remove the item from the database
                itemRef.remove()
                    .then(function() {
                        console.log("Item successfully deleted");
                        // Redirect the user to a different page or perform any other action
                        // For example, redirecting to the homepage
                        window.location.href = "index.html";
                    })
                    .catch(function(error) {
                        console.error("Error deleting item: ", error);
                    });
            }
        });

            } else {
                // Item not found, handle error
                document.getElementById('itemDetails').innerHTML = '<p>Item not found.</p>';
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
function getLocationAndComputeDistance(itemLatitude, itemLongitude) {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            var userLatitude = position.coords.latitude;
            var userLongitude = position.coords.longitude;

            var distance = computeDistance(userLatitude, userLongitude, itemLatitude, itemLongitude);
            displayDistance(distance);
        });
    } else {
        document.getElementById('distanceContainer').innerHTML = "Geolocation is not supported by this browser.";
    }
}

function computeDistance(lat1, lon1, lat2, lon2) {
    var R = 6371; // Radius of the earth in kilometers
    var dLat = deg2rad(lat2 - lat1);
    var dLon = deg2rad(lon2 - lon1);
    var a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c; // Distance in kilometers
    return d;
}

function deg2rad(deg) {
    return deg * (Math.PI / 180);
}
function displayDistance(distance) {
    // Round off the distance to two decimal places
    var roundedDistance = Math.round(distance * 100) / 100;

    // Display the rounded distance in the distanceContainer div
    document.getElementById('distanceContainer').innerHTML = "Ang distansya ay " + roundedDistance + " kilometers.";
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

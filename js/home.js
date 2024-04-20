 
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

        // Reference to the items container
        var itemsContainer = document.getElementById('itemsContainer');

       
		function displayItems(snapshot) {
            itemsContainer.innerHTML = ''; // Clear previous items
        
            snapshot.forEach(function(childSnapshot) {
                var item = childSnapshot.val();
                
                // Check if the item's status is "Available"
                if (item.status === "Available") {
                    var itemHtml = `
                    <div class="item" style="background-color: white; border-radius: 10px; padding: 10px;">
                            <a href="detailsItem.html?itemId=${childSnapshot.key}">
                                <div class="mainImg">
                                    <img src='${item.dataImage}' alt="">
                                    <span class="text">
                                        <p>${item.dataTitle}</p>
                                        <p>${item.category}</p>
                                        <h3>${item.dataLang}</h3>
                                        <div class="left">
                                            <div class="circle-pic">
                                                <img src="${item.profile}" alt="">
                                            </div>
                                            <p>${item.username}</p>
                                        </div>
                                    </span>
                                </div>
                            </a>
                        </div>`;
                    itemsContainer.innerHTML += itemHtml;
                }
            });
        }
        

        // Fetch and display items initially
        itemsRef.once('value', function(snapshot) {
            displayItems(snapshot);
        });

        // Listen for changes in the database and update the displayed items
        itemsRef.on('value', function(snapshot) {
            displayItems(snapshot);
        });

        // Function to filter items based on search input
        function filterItems() {
            var searchInput = document.getElementById('searchInput').value.trim().toLowerCase();
            var items = document.getElementsByClassName('item');
            for (var i = 0; i < items.length; i++) {
                var category = items[i].querySelector('p:first-of-type').textContent.toLowerCase();
                if (category.includes(searchInput)) {
                    items[i].style.display = 'block'; // Show item if category matches search input
                } else {
                    items[i].style.display = 'none'; // Hide item if category does not match search input
                }
            }
        }

        // Handle form submission
        document.getElementById('searchForm').addEventListener('submit', function(event) {
            event.preventDefault(); // Prevent form submission
            filterItems(); // Call filterItems function to filter items based on search input
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

let map, directionsService, directionsRenderer, userMarker, destinationMarker;
console.log("I am being loaded.");
// function initMap() {
//   // Initialize the map centered on a default location
//   map = new google.maps.Map(document.getElementById("map"), {
//     center: { lat: 43.7, lng: -79.42 }, // Default to Toronto
//     zoom: 12,
//   });

//   // Initialize Directions Service and Renderer
//   directionsService = new google.maps.DirectionsService();
//   directionsRenderer = new google.maps.DirectionsRenderer();
//   directionsRenderer.setMap(map);

//   // Get user's current location
//   if (navigator.geolocation) {
//     navigator.geolocation.getCurrentPosition(
//       function (position) {
//         const userLat = position.coords.latitude;
//         const userLng = position.coords.longitude;

//         // Set the map center to the user's location
//         map.setCenter({ lat: userLat, lng: userLng });

//         // Create a marker for the user's current location
//         userMarker = new google.maps.Marker({
//           position: { lat: userLat, lng: userLng },
//           map: map,
//           title: "Your Location",
//           icon: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png", // Blue icon for the user
//         });
//       },
//       function () {
//         alert("Geolocation failed or is not supported by your browser.");
//       }
//     );
//   }

//   // Autocomplete for destination input field
//   const input = document.getElementById("destination-input");
//   const autocomplete = new google.maps.places.Autocomplete(input);
//   autocomplete.bindTo("bounds", map);

//   // Autocomplete for start location input field
//   const startInput = document.getElementById("start-input");
//   const startAutocomplete = new google.maps.places.Autocomplete(startInput);
//   startAutocomplete.bindTo("bounds", map);

//   // Handle the 'Go' button click or Enter key
//   const goButton = document.getElementById("go-button");
//   goButton.addEventListener("click", function () {
//     getDirections(input.value);
//   });

//   // Handle Enter key press
//   input.addEventListener("keypress", function (e) {
//     if (e.key === "Enter") {
//       e.preventDefault(); // Prevent form submission
//       getDirections(input.value);
//     }
//   });

//   const travelModeDropdown = document.getElementById("travel-mode");
//   travelModeDropdown.addEventListener("change", function () {
//     if (destinationMarker) {
//       // Recalculate directions when travel mode changes
//       const destination = destinationMarker.getPosition();
//       getDirections(null, travelModeDropdown.value, destination);
//     }
//   });
// }

function initMap() {
  // Initialize the map centered on a default location
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 43.7, lng: -79.42 }, // Default to Toronto
    zoom: 12,
  });

  // Initialize Directions Service and Renderer
  directionsService = new google.maps.DirectionsService();
  directionsRenderer = new google.maps.DirectionsRenderer();
  directionsRenderer.setMap(map);

  // Get user's current location
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      function (position) {
        const userLat = position.coords.latitude;
        const userLng = position.coords.longitude;

        // Set the map center to the user's location
        map.setCenter({ lat: userLat, lng: userLng });

        // Create a marker for the user's current location
        userMarker = new google.maps.Marker({
          position: { lat: userLat, lng: userLng },
          map: map,
          title: "Your Location",
          icon: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png", // Blue icon for the user
        });
      },
      function () {
        alert("Geolocation failed or is not supported by your browser.");
      }
    );
  }

  // Autocomplete for destination input field
  const destinationInput = document.getElementById("destination-input");
  const destinationAutocomplete = new google.maps.places.Autocomplete(destinationInput);
  destinationAutocomplete.bindTo("bounds", map);

  // Autocomplete for start location input field
  const startInput = document.getElementById("start-input");
  const startAutocomplete = new google.maps.places.Autocomplete(startInput);
  startAutocomplete.bindTo("bounds", map);

  // Handle the 'Go' button click or Enter key
  const goButton = document.getElementById("go-button");
  goButton.addEventListener("click", function () {
    // Get the travel mode
    const travelMode = document.getElementById("travel-mode").value;
    getDirections(startInput.value, destinationInput.value, travelMode);
  });

  // Handle Enter key press for both inputs (start and destination)
  destinationInput.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      e.preventDefault(); // Prevent form submission
      const travelMode = document.getElementById("travel-mode").value;
      getDirections(startInput.value, destinationInput.value, travelMode);
    }
  });

  startInput.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      e.preventDefault(); // Prevent form submission
      const travelMode = document.getElementById("travel-mode").value;
      getDirections(startInput.value, destinationInput.value, travelMode);
    }
  });

  const travelModeDropdown = document.getElementById("travel-mode");
  travelModeDropdown.addEventListener("change", function () {
    if (destinationMarker) {
      // Get the position of the destination marker
      const destination = destinationMarker.getPosition();

      // Ensure that the destination is a valid LatLng object
      if (destination && destination.lat() !== undefined && destination.lng() !== undefined) {
        console.log(
          "Updated Destination Latitude: " + destination.lat() + ", Longitude: " + destination.lng()
        );

        // Get the starting location: if input is provided, use it, else fallback to user location
        let startLocation = startInput.value || null;

        // If the startInput value is empty, use the user's current location
        if (!startLocation && userMarker) {
          startLocation = userMarker.getPosition();
        }

        // Ensure startLocation is a valid string or LatLng object
        if (
          typeof startLocation === "string" ||
          (startLocation && startLocation.lat && startLocation.lng)
        ) {
          // Call getDirections with the correct parameters
          console.log("this destination", destination.lat(), destination.lng());
          getDirections(startLocation, destinationInput.value, travelModeDropdown.value);
        } else {
          console.error("Invalid start location.");
        }
      } else {
        console.error("Invalid destination marker.");
      }
    }
  });
}

// function getDirections(destination, travelMode = "DRIVING", destinationCoords = null) {
//   // Get the start location either from the input or from the user's current location
//   let start;

//   // Check if startInput is provided (meaning user has entered a start location)
//   if (startInput && startInput.value.trim() !== "") {
//     // If startInput is not empty, geocode the input value
//     const geocoder = new google.maps.Geocoder();
//     geocoder.geocode({ address: startInput.value }, function (results, status) {
//       if (status === google.maps.GeocoderStatus.OK) {
//         // Use the geocoded result for the start location
//         start = results[0].geometry.location;

//         // Call the function to get directions using this start location
//         handleDirections(start, destination, travelMode, destinationCoords);
//       } else {
//         alert("Geocode failed for the start address: " + status);
//       }
//     });
//   } else {
//     // If no start input, use the user's current location (default start location)
//     if (!userMarker) {
//       alert("Unable to determine your location.");
//       return;
//     }

//     start = new google.maps.LatLng(userMarker.getPosition().lat(), userMarker.getPosition().lng());

//     // Call the function to get directions using the user's location
//     handleDirections(start, destination, travelMode, destinationCoords);
//   }
// }

// function handleDirections(start, destination, travelMode, destinationCoords) {
//   // Check if destination is provided, either as a string or coordinates
//   if (!destination && !destinationCoords) {
//     alert("No destination specified.");
//     return;
//   }

//   // Function to handle the destination (whether it's a geocoded address or provided coordinates)
//   const handleDestination = (end) => {
//     // Remove previous destination marker
//     if (destinationMarker) {
//       destinationMarker.setMap(null);
//     }

//     // Create a new destination marker
//     destinationMarker = new google.maps.Marker({
//       position: end,
//       map: map,
//       title: "Destination",
//       icon: "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
//     });

//     // Clear previous routes
//     if (window.polylines) {
//       window.polylines.forEach((polyline) => polyline.setMap(null));
//     }
//     window.polylines = [];

//     // Clear the legend list
//     const legendList = document.getElementById("legend-list");
//     legendList.innerHTML = "";

//     // Prepare the route request
//     const request = {
//       origin: start,
//       destination: end,
//       travelMode: google.maps.TravelMode[travelMode],
//       unitSystem: google.maps.UnitSystem.METRIC,
//       provideRouteAlternatives: true,
//     };

//     const colors = ["#FF0000", "#0000FF", "#00FF00", "#FFA500", "#800080"];

//     // Request for directions
//     directionsService.route(request, function (response, status) {
//       if (status === google.maps.DirectionsStatus.OK) {
//         response.routes.forEach((route, index) => {
//           // Create a polyline for each route
//           const routePolyline = new google.maps.Polyline({
//             path: route.overview_path,
//             geodesic: true,
//             strokeColor: colors[index % colors.length],
//             strokeOpacity: 0.7,
//             strokeWeight: 4,
//             map: map,
//           });

//           window.polylines.push(routePolyline);

//           // Add a corresponding item to the legend list
//           const listItem = document.createElement("li");
//           const colorBox = document.createElement("span");
//           colorBox.style.backgroundColor = colors[index % colors.length];
//           listItem.appendChild(colorBox);
//           listItem.appendChild(document.createTextNode(`Route ${index + 1}`));
//           legendList.appendChild(listItem);
//         });

//         sendRouteDataToBackend(start, destination);
//       } else {
//         alert("Directions request failed due to " + status);
//       }
//     });
//   };

//   // If destinationCoords is provided, use it directly
//   if (destinationCoords) {
//     handleDestination(destinationCoords);
//   } else {
//     // Otherwise, geocode the destination address
//     const geocoder = new google.maps.Geocoder();
//     geocoder.geocode({ address: destination }, function (results, status) {
//       if (status === google.maps.GeocoderStatus.OK) {
//         // Geocode successful, handle the destination
//         handleDestination(results[0].geometry.location);
//       } else {
//         alert("Geocode failed for the destination address: " + status);
//       }
//     });
//   }
// }

function getDirections(start, destination, travelMode = "DRIVING", destinationCoords = null) {
  // Get the start location either from the input or from the user's current location
  let startLocation;

  // Check if start input is provided (meaning user has entered a start location)
  if (typeof start === "string" && start.trim() !== "") {
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ address: start }, function (results, status) {
      if (status === google.maps.GeocoderStatus.OK) {
        startLocation = results[0].geometry.location;

        updateStartMarker(startLocation);

        // Call the function to get directions using this start location
        handleDirections(startLocation, destination, travelMode, destinationCoords);
      } else {
        alert("Geocode failed for the start address: " + status);
      }
    });
  } else {
    // If no start input, use the user's current location
    if (!userMarker) {
      alert("Unable to determine your location.");
      return;
    }

    startLocation = new google.maps.LatLng(
      userMarker.getPosition().lat(),
      userMarker.getPosition().lng()
    );

    updateStartMarker(startLocation);
    // Call the function to get directions using the user's location
    console.log(destination);

    handleDirections(startLocation, destination, travelMode, destinationCoords);
  }
}

function handleDirections(start, destination, travelMode, destinationCoords) {
  // Check if destination is provided, either as a string or coordinates
  if (!destination && !destinationCoords) {
    alert("No destination specified.");
    return;
  }

  // Function to handle the destination (whether it's a geocoded address or provided coordinates)
  const handleDestination = (end) => {
    // Remove previous destination marker
    if (destinationMarker) {
      destinationMarker.setMap(null);
    }

    // Create a new destination marker
    destinationMarker = new google.maps.Marker({
      position: end,
      map: map,
      title: "Destination",
      icon: "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
    });

    // Clear previous routes
    if (window.polylines) {
      window.polylines.forEach((polyline) => polyline.setMap(null));
    }
    window.polylines = [];

    // Clear the legend list
    const legendList = document.getElementById("legend-list");
    legendList.innerHTML = "";

    // Prepare the route request
    const request = {
      origin: start,
      destination: end,
      travelMode: google.maps.TravelMode[travelMode],
      unitSystem: google.maps.UnitSystem.METRIC,
      provideRouteAlternatives: true,
    };

    const colors = ["#FF0000", "#0000FF", "#00FF00", "#FFA500", "#800080"];

    // Request for directions
    directionsService.route(request, function (response, status) {
      if (status === google.maps.DirectionsStatus.OK) {
        response.routes.forEach((route, index) => {
          // Create a polyline for each route
          const routePolyline = new google.maps.Polyline({
            path: route.overview_path,
            geodesic: true,
            strokeColor: colors[index % colors.length],
            strokeOpacity: 0.7,
            strokeWeight: 4,
            map: map,
          });

          window.polylines.push(routePolyline);

          // Add a corresponding item to the legend list
          const listItem = document.createElement("li");
          const colorBox = document.createElement("span");
          colorBox.style.backgroundColor = colors[index % colors.length];
          listItem.appendChild(colorBox);
          listItem.appendChild(document.createTextNode(`Route ${index + 1}`));
          legendList.appendChild(listItem);
        });

        sendRouteDataToBackend(start, destination, travelMode);
      } else {
        alert("Directions request failed due to " + status);
      }
    });
  };

  // If destinationCoords is provided, use it directly
  if (destinationCoords) {
    handleDestination(destinationCoords);
  } else {
    // Otherwise, geocode the destination address
    console.log("here");
    console.log(destination);

    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ address: destination }, function (results, status) {
      if (status === google.maps.GeocoderStatus.OK) {
        // Geocode successful, handle the destination
        handleDestination(results[0].geometry.location);
      } else {
        alert("Geocode failed for the destination address: " + status);
      }
    });
  }
}

function updateStartMarker(startLocation) {
  // If a start marker already exists, remove it
  if (userMarker) {
    userMarker.setMap(null);
  }

  // Create a new marker at the updated start location
  userMarker = new google.maps.Marker({
    position: startLocation,
    map: map,
    title: "Starting Location",
    icon: "http://maps.google.com/mapfiles/ms/icons/green-dot.png", // Green icon for start point
  });

  // Recenter the map on the new start location
  map.setCenter(startLocation);
}

function sendRouteDataToBackend(start, destination, travelMode) {
  const data = {
    lat: start.lat(),
    lng: start.lng(),
    destination: destination,
    travelMode: travelMode,
  };
  console.log(data);

  fetch("/get_routes", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Response from backend:", data);

      // Extract predictions from nested structure
      const predictions = data.predictions.predictions; // Adjusted for the nested structure

      // Update the legend
      const legendList = document.getElementById("legend-list");
      legendList.innerHTML = ""; // Clear previous legend entries

      // Map predicted class to descriptive text
      const classMapping = {
        0: "Medium",
        1: "High",
        2: "Very High",
      };

      Object.keys(predictions).forEach((routeKey, index) => {
        const prediction = predictions[routeKey];
        const listItem = document.createElement("li");

        // Add a color box for visual distinction (optional)
        const colorBox = document.createElement("span");
        colorBox.style.backgroundColor = ["#FF0000", "#0000FF", "#00FF00", "#FFA500", "#800080"][
          index % 5
        ];
        colorBox.style.display = "inline-block";
        colorBox.style.width = "10px";
        colorBox.style.height = "10px";
        colorBox.style.marginRight = "10px";

        // Add text for mapped class, confidence, and risk score
        const predictionText = `Route ${index + 1}: Risk Level - ${
          classMapping[prediction.overall_predicted_class]
        }, Confidence: ${(prediction.overall_confidence * 100).toFixed(
          2
        )}%, Risk Score: ${prediction.risk_score.toFixed(3)}`;

        listItem.appendChild(colorBox);
        listItem.appendChild(document.createTextNode(predictionText));
        legendList.appendChild(listItem);
      });
    })
    .catch((error) => {
      console.error("Error sending data to backend:", error);
    });
}

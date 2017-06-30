var map;
var markers = [];
var locations = [
  {title: 'Griffith Park', location: {lat: 34.136555, lng: -118.294197}},
  {title: 'Hollywood Bowl', location: {lat: 34.112224, lng: -118.339128}},
  {title: 'TCL Chinese Theatre', location: {lat: 34.102023, lng: -118.340971}},
  {title: 'Runyon Canyon Park ', location: {lat: 34.110681, lng: -118.350378}},
  {title: 'LACMA', location: {lat: 34.063932, lng: -118.359229}}
];

function initMap() {
  // Constructor creates a new map - only center and zoom are required.
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 34.05223, lng: -118.24368},
    zoom: 12,
    mapTypeControl: false
  });
  // Creates infowindow object for a marker to display info
  var largeInfowindow = new google.maps.InfoWindow();
  // Style the markers a bit. This will be our listing marker icon.
  var defaultIcon = makeMarkerIcon('0091ff');
  // Create a "highlighted location" marker color for when the user
  // mouses over the marker.
  var highlightedIcon = makeMarkerIcon('FFFF24');

  // Uses the location array to create an array of markers on initialize.
  for (var i = 0; i < locations.length; i++) {
    // Get the position from the location array.
    var position = locations[i].location;
    var title = locations[i].title;
    // Create a marker per location, and put into markers array.
    var marker = new google.maps.Marker({
    map: map,
    position: position,
    title: title,
    animation: google.maps.Animation.DROP,
    icon: defaultIcon,
    id: i
    });
    // Push the marker to our array of markers.
    markers.push(marker);
    // Create an onclick event to open an infowindow at each marker.
    marker.addListener('click', function() {
      populateInfoWindow(this, largeInfowindow);
    });
    // Two event listeners - one for mouseover, one for mouseout,
    // to change the colors back and forth.
    marker.addListener('mouseover', function() {
      this.setIcon(highlightedIcon);
    });
    marker.addListener('mouseout', function() {
      this.setIcon(defaultIcon);
    });
  }
  showListings();
}

// Animate marker when clicked
function makeMarkerBounce(marker) {
  marker.setAnimation(google.maps.Animation.BOUNCE);
  setTimeout(function() {
    marker.setAnimation(null);
  }, 1400);
}

// This function populates the infowindow when the marker is clicked. We'll only
// allow one infowindow which will open at the marker that is clicked, and
// populate based on that markers position.
function populateInfoWindow(marker, infowindow) {
  //Animate marker when clicked
  makeMarkerBounce(marker);
  // Check to make sure the infowindow is not already open on this marker.
  if (infowindow.marker != marker) {
    infowindow.marker = marker;
    infowindow.setContent('<div>' + marker.title + '</div>');
    infowindow.open(map, marker);
    // Make sure the marker property is cleared if the infowindow is closed.
    infowindow.addListener('closeclick',function(){
      infowindow.setMarker = null;
    });
  }
}

// This function will loop through the markers array and display them all.
function showListings() {
  // Limits the map to display all the locations on the screen
  var bounds = new google.maps.LatLngBounds();
  // Extend the boundaries of the map for each marker and display the marker
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(map);
    bounds.extend(markers[i].position);
  }
  // Extend the boundaries of the map for each marker
  map.fitBounds(bounds);
}

// This function will loop through the listings and hide them all.
function hideListings() {
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(null);
  }
}

// This function takes in a COLOR, and then creates a new marker
// icon of that color. The icon will be 21 px wide by 34 high, have an origin
// of 0, 0 and be anchored at 10, 34).
function makeMarkerIcon(markerColor) {
  var markerImage = new google.maps.MarkerImage(
    'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|'+
    markerColor + '|40|_|%E2%80%A2',
    new google.maps.Size(21, 34),
    new google.maps.Point(0, 0),
    new google.maps.Point(10, 34),
    new google.maps.Size(21,34));
  return markerImage;
}

// Handle Google Maps API error
function googleMapsError() {
	alert("Google Maps failed to load. Please try again.");
}

// Defines the data and behavior of UI
function AppViewModel() {
}

// Activate knockout.js
ko.applyBindings(new AppViewModel());

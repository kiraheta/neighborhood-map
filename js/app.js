var map;
var markers = [];
var locations = [
  {title: 'Griffith Park', location: {lat: 34.136555, lng: -118.294197}},
  {title: 'Hollywood Bowl', location: {lat: 34.112224, lng: -118.339128}},
  {title: 'Hollywood Sign', location: {lat: 34.134073, lng: -118.321548}},
  {title: 'TCL Chinese Theatre', location: {lat: 34.102023, lng: -118.340971}},
  {title: 'Runyon Canyon Park ', location: {lat: 34.110681, lng: -118.350378}},
  {title: 'LACMA', location: {lat: 34.063932, lng: -118.359229}}
];
var largeInfoWindow;

function initMap() {
  // Constructor creates a new map - only center and zoom are required.
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 34.05223, lng: -118.24368},
    zoom: 12,
    mapTypeControl: false
  });
  // Creates infowindow object for a marker to display info
  largeInfoWindow = new google.maps.InfoWindow();
  // Style the markers a bit. This will be our listing marker icon.
  var defaultIcon = 'http://maps.google.com/mapfiles/ms/icons/red-dot.png';
  // Create a "highlighted location" marker color for when the user
  // mouses over the marker.
  var highlightedIcon = 'http://maps.google.com/mapfiles/ms/icons/yellow-dot.png';

  // Uses the location array to create an array of markers on initialize.
  for (var i = 0; i < locations.length; i++){
    // Get the position from the location array.
    var position = locations[i].location;
    var title = locations[i].title;

    // Create a marker per location, and put into markers array.
    var marker = new google.maps.Marker({
      position: position,
      title: title,
      animation: google.maps.Animation.DROP,
      icon: defaultIcon,
      id: i
    });

    // Push the marker to our array of markers.
    markers.push(marker);

    // Create an onclick event to open an infowindow at each marker.
    marker.addListener('click',function(){
      populateInfoWindow(this,largeInfoWindow);
    });

    // Two event listeners - one for mouseover, one for mouseout,
    // to change the colors back and forth.
    marker.addListener('mouseover', function(){
      this.setIcon(highlightedIcon);
    });

    marker.addListener('mouseout', function(){
      this.setIcon(defaultIcon);
    });
  }
  showListings();
}

// Animate marker if clicked
function makeMarkerBounce(marker) {
  marker.setAnimation(google.maps.Animation.BOUNCE);
  setTimeout(function() {
    marker.setAnimation(null);
  }, 1400);
}

// This function populates the infowindow when the marker is clicked
// based on that markers position.
function populateInfoWindow(marker, infoWindow){
  // Animate marker if clicked
  makeMarkerBounce(marker);
  if(infoWindow.marker != marker){
    infoWindow.marker = marker;
    infoWindow.setContent('<div class="location-title">' + marker.title);
    infoWindow.open(map,marker);
    infoWindow.addListener('closeclick', function(){
      infoWindow.marker = null;
    });
  }
}

// This function will loop through the markers array and display them all.
function showListings(){
  // Limits the map to display all the locations on the screen
  var bounds = new google.maps.LatLngBounds();
  // Extend the boundaries of the map for each marker and display the marker
  for (var i = 0; i < markers.length; i++){
    markers[i].setMap(map);
    bounds.extend(markers[i].position);
  }
  // Extend the boundaries of the map for each marker
  map.fitBounds(bounds);
}

// This function will loop through the listings and hide them all.
function hideListings(){
  for(var i = 0; i < markers.length; i++){
    markers[i].setMap(null);
  }
}

function getLocation(value){
  if (largeInfoWindow.marker != value.location) {
    for (var i = 0; i < markers.length; i++) {
      if (markers[i].title == value.title) {
        populateInfoWindow(markers[i], largeInfoWindow);
        break;
      }
    }
  }
}

// Handle Google Maps API error
function googleMapsError() {
  alert("Google Maps failed to load. Please try again.");
}

// Defines the data and behavior of UI
var appViewModel = {
  query: ko.observable(''),
  locationList: ko.observableArray([]),

  // Store locations array into knockout array
  setLocations: function(query){
    for(var l in locations){
      appViewModel.locationList.push(locations[l]);
    }
  },

  // Search for input query
  searchQuery: function(query) {
    appViewModel.locationList.removeAll();

    for (var i = 0; i < markers.length; i++) {
      markers[i].setVisible(false);
    }

    for(var l in locations) {
      if(locations[l].title.toLowerCase().indexOf(query.toLowerCase()) >= 0) {
        appViewModel.locationList.push(locations[l]);
        var knockoutMarker = locations[l].location;

        for (var i = 0; i < markers.length; i++) {
          if (markers[i].position.lat().toFixed(5) == knockoutMarker.lat.toFixed(5) &&
              markers[i].position.lng().toFixed(5) == knockoutMarker.lng.toFixed(5)) {
                markers[i].setVisible(true);
          }
        }
      }
    }
  }
};

// Activate knockout.js
appViewModel.setLocations();
appViewModel.query.subscribe(appViewModel.searchQuery);
ko.applyBindings(appViewModel);

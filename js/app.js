var map;

function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 34.05223, lng: -118.24368},
    zoom: 12
  });
}

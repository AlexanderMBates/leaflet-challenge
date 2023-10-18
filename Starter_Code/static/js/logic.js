// Create the map and set the initial view
var myMap = L.map("map", {
    center: [40, -100],
    zoom: 3
  });
  
  // Add a tile layer to the map
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(myMap);
  
  // Define earthquake data URL
  var earthquakeDataUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.geojson";
  
  // Create a function to set the size of earthquake markers based on magnitude
  function markerSize(magnitude) {
    return magnitude * 5000;
  }
  
  // Create a function to set the color of earthquake markers based on depth
  function getColor(depth) {
    if (depth < 10) {
      return "#00ff00"; // Green
    } else if (depth < 30) {
      return "#ffff00"; // Yellow
    } else if (depth < 50) {
      return "#ff9900"; // Orange
    } else if (depth < 70) {
      return "#ff3300"; // Red
    } else {
      return "#990000"; // Dark Red
    }
  }
  
  // Create a legend control
  var legend = L.control({ position: "bottomright" });
  
  legend.onAdd = function (map) {
    var div = L.DomUtil.create("div", "info legend");
    var depths = [-10, 10, 30, 50, 70];
    var labels = [];
  
    for (var i = 0; i < depths.length; i++) {
      div.innerHTML +=
        '<i style="background:' + getColor(depths[i] + 1) + '"></i> ' +
        depths[i] + (depths[i + 1] ? '&ndash;' + depths[i + 1] + '<br>' : '+');
    }
  
    return div;
  };
  
  // Add the legend to the map
  legend.addTo(myMap);
  
  // Fetch earthquake data
  d3.json(earthquakeDataUrl).then(function (data) {
    L.geoJSON(data, {
      pointToLayer: function (feature, latlng) {
        return L.circle(latlng, {
          radius: markerSize(feature.properties.mag),
          fillColor: getColor(feature.geometry.coordinates[2]),
          fillOpacity: 0.7,
          color: "black",
          weight: 0.5,
          opacity: 1,
        }).bindPopup("<h3>" + feature.properties.place + "</h3><hr><p>Magnitude: " + feature.properties.mag + "<br>Depth: " + feature.geometry.coordinates[2] + "</p>");
      },
    }).addTo(myMap);
  });
  
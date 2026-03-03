// Store our API endpoint as queryUrl.
let queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson";

// Perform a GET request to the query URL.
d3.json(queryUrl).then(function(data) {
  createFeatures(data.features);
});

function depthColor(depth) {
    
  if ( depth < 10) return "#f5ff2d";
  else if (depth < 30) return "#c1de84";
  else if (depth < 50) return "#c3c882";
  else if (depth < 70) return "#d49468";
  else if (depth < 90) return "#e45241";
  else return "#e9002c";}

function markerSize(mag) {
    return Math.max(mag * 3, 3);
  }


// Define a function to create map features.
function createFeatures (earthquakeData) {
  let earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature,
    pointToLayer: function(feature, latlng){
      return L.circleMarker(latlng, {
        fillOpacity: 0.75,
        color: depthColor(feature.geometry.coordinates[2]),
        fillColor: depthColor(feature.geometry.coordinates[2]),
        radius: markerSize(feature.properties.mag),
        
      });  
  }
    });
  
    // Send our earthquakes layer to the createMap function/
  createMap(earthquakes);
  }
  

 function onEachFeature(feature, layer) {
  layer.bindPopup(`<h3>${feature.properties.place}</h3><hr><h5>Magnitude: ${feature.properties.mag}</h5><p>Depth: ${feature.geometry.coordinates[2]}</p>`);}


function createMap(earthquakes) {


   // Create the base layers.
  let topo = L.tileLayer("https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png", {
    attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)',
  });

  let baseMaps = {
    "Topographic Map": topo,
  };
   // Create an overlay object to hold our overlay.
   let overlayMaps = {
    Earthquakes: earthquakes,
  };
  let myMap = L.map("map", {
    center: [37.09, -95.71],
    zoom: 5,
    layers: [topo, earthquakes]
  });

  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false,
  }).addTo(myMap);

  // Create a legend control
  let legend = L.control({ position: 'bottomright' });

  legend.onAdd = function(map) {
    const div = L.DomUtil.create('div', 'info legend');
    const depthRanges = ['-10-10', '10-30', '30-50', '50-70', '70-90', '90+'];
    const colors = ['#f5ff2d', '#c1de84', '#c3c882', '#d49468', '#e45241', '#e9002c'];

    div.innerHTML += '<h4>Depth Legend</h4>';
    for (let i = 0; i < depthRanges.length; i++) {
      div.innerHTML += `
        <div class="legend-item">
          <div class="legend-color" style="background-color: ${colors[i]};"></div>
          <span>${depthRanges[i]}</span>
        </div>
      `;
    }

    return div;
  };
  // Adding the legend to the map
  legend.addTo(myMap);
  
}



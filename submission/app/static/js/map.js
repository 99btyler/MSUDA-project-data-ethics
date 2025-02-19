 
 // Color of the marker/magnitude 
function chooseColor(mag) {
  let color = "";

  // If statement on color
  if (mag > 5) {        
  } else if (mag > 4) {
    color = "red";    // Magnitude 5
  } else if (mag > 3) {
    color = "lightcoral";   // Magnitude 4
  } else if (mag > 2) {
    color = "lightpink"; // Magnitude 3
  } else if (mag > 1) {
    color = "blue"; // Magnitude 2
  } else {
    color = "violet"; // Magnitude 1
  }

  return color;
}
  function createMap(complaint_type) {
    // Delete Map
    let map_container = d3.select("#map_container");
    map_container.html(""); // empties it
    map_container.append("div").attr("id", "map"); //recreate it
  
  
    // Step 1: CREATE THE BASE LAYERS
    let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    })
  
    let topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
    });

  
    // Assemble the API query URL.
    let url = "/api/v1.0/map_data";
    console.log(url);
  
    d3.json(url).then(function (data) {
      // Step 2: CREATE THE DATA/OVERLAY LAYERS
      console.log(data);
  
      // Initialize the Cluster Group
      let heatArray = [];
      let markers = L.markerClusterGroup();
  
      // Loop and create marker
      data.forEach(row => {
        let popupContent = `<div style="font-size:12px; line-height:1.2em; padding:5px;">
                                <strong>Lat:</strong> ${row.start_latitude}<br>
                                <strong>Lng:</strong> ${row.start_longitude}<br>
                                <strong>Year:</strong> ${row.year}<br>
                                <strong>Magnitude:</strong> ${row.tornado_magnitude}<br>
                                <strong>State:</strong> ${row.state}
                            </div>`;

        let marker_style = L.ExtraMarkers.icon({
          icon: "ion-android-sync",
          iconColor: "white",
          markerColor: chooseColor(row.tornado_magnitude),
          shape: "circle"
        });

        let marker = L.marker([row.start_latitude, row.start_longitude], {icon:marker_style})
            .bindPopup(popupContent, { maxWidth: 200, minWidth: 100 });
        markers.addLayer(marker);
        heatArray.push([row.start_latitude, row.start_longitude]);
    });
  
      // Create Heatmap Layer
      let heatLayer = L.heatLayer(heatArray, {
        radius: 25,
        blur: 10
      });
  
      // Step 3: CREATE THE LAYER CONTROL
      let baseMaps = {
        Street: street,
        Topography: topo
      };
  
      let overlayMaps = {
        HeatMap: heatLayer,
        
      };
  
      // Step 4: INITIALIZE THE MAP
      let myMap = L.map("map", {
        center: [37.964, -91.832],
        zoom: 4,
        layers: [street, markers]
      });
  
      // Step 5: Add the Layer Control, Legend, Annotations as needed
      L.control.layers(baseMaps, overlayMaps).addTo(myMap);
    });
  }
  
  function init() {
    let complaint_type = d3.select("#complaint_type").property("value");
    createMap(complaint_type);
  }
  
  // Event Listener
  d3.select("#filter-btn").on("click", function () {
    init();
  });
  
  // on page load
  init();
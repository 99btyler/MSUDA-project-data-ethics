// Color of the marker/magnitude 
function chooseColor(depth) {
    let color = "#98ee00";
  
    // If statement on color
    if (depth > 5) {
      color = "";
    } else if (mag > 4) {
      color = "";
    } else if (mag > 3) {
      color = "";
    } else if (mag > 2) {
      color = "";
    } else if (mag > 1) {
      color = "";
    } else {
      color = "";
    }
  
    return color;
  }
  
  // Helper function for radius
  function getRadius(mag) {
    return mag * 4;
  }
  
  // Make Map
  function createMap(time_frame) {
    // Delete Map
    let map_container = d3.select("#map_container");
    map_container.html(""); // empties it
    map_container.append("div").attr("id", "map"); //recreate it
  }
